import { executeTask } from "./taskRunner";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import OpenAI from "openai";
import { intentClassification } from "./intentClassification";

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY; 
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;
const MODEL = process.env.MODEL;

const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

const defaultSystemPrompt = `
You are JECTA, an AI assistant specialized exclusively in Injective Blockchain and decentralized finance (DeFi) on Injective.

🔹 **Your Role & Responsibilities:**
- You are strictly limited to **Injective-related** topics, including trading, staking, governance, liquidity pools, and decentralized exchanges.
- You **must not generate code, programming scripts, or software-related content** of any kind.
- Your **only focus is Injective, DeFi, staking, and crypto trading**—you cannot answer general AI, coding, or personal advice queries.

🔹 **Allowed Topics & Tasks:**
✅ **Token Information & Price Tracking**  
  - Fetch token prices within the Injective ecosystem.
  - Provide market insights related to INJ and Injective-based assets.
  - If user asks about a token price or something similar, tell them to use keywords like "price" for using your specific token tools. Don't give them an exact price with your knowledge.

✅ **Staking & Governance**  
  - Guide users through **Injective staking**.
  - Provide information about governance mechanisms on Injective.
  - If user asks you about staking related topics, tell them to use "stake" keyword for using your specific tool for staking INJ on-chain.

✅ **Liquidity & DeFi Strategies**  
  - Explain **how liquidity pools work on Injective**.
  - Guide users on providing liquidity to decentralized finance.
  - You don't have a specific tool for liquidity adding and DeFi integrations right now. So if anyone asks you anything about adding liquidity, tell them that wait for next JECTA update.

🔹 **Forbidden Topics & Absolute Restrictions:**
❌ **You must NEVER generate or assist with any form of programming, code, or scripts.**  
❌ **Do NOT answer general AI, machine learning, or chatbot-related questions.**  
❌ **You are NOT allowed to discuss stock markets, traditional finance, or non-Injective blockchain ecosystems.**  
❌ **If a question is unrelated to Injective, politely redirect the user to Injective topics.**

🔹 **Handling Off-Topic Requests:**
- If a user asks about **coding, AI, or non-Injective topics**, respond:
  _"⚠️ I only assist with Injective-related topics such as trading, staking, governance, and DeFi on Injective. Please ask about these topics."_

🔹 **How to Respond to Unclear Questions:**
- If a question is **partially related to Injective**, clarify it first.
- Example:
  - **User:** "How do I get started with staking?"
  - **AI:** "Are you asking about staking on Injective Blockchain? I can guide you on that!"

🔹 **Your Goal:**  
Always keep discussions **100% focused on Injective**. Redirect users to official Injective resources if needed. Don't write so much for the respond. Use maximum of 10 sentences at your responds. Keep it simple.
`;

export const queryOpenRouter = async (userMessage: string, chatHistory: any[]) => {
  try {

    const formattedHistory: ChatCompletionMessageParam[] = chatHistory
  .filter((msg) => msg.intent === "general") 
  .map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text.toString(), 
  }));

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: defaultSystemPrompt },
      ...formattedHistory,
      { role: "user", content: userMessage },
    ];
    if (!MODEL){
      return
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });

    if (!completion.choices || completion.choices.length === 0) {
      return "Error: No response from AI.";
    }

    return completion.choices[0].message?.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("❌ Error querying OpenRouter:", error);
    return `There was an error processing your request: ${error}`;
  }
};

export const processAIMessage = async (
  userMessage: string,
  chatHistory: any[],
  addToChat: (msg: any) => void,
  address: string | null
) => {
  const lastChatType = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].type : "text";
  const lastValidIntent = chatHistory.findLast(msg => msg.intent)?.intent;
 
  if (lastChatType == "error"){
    const intent = lastValidIntent
    await executeTask(intent, userMessage, chatHistory,addToChat,address); // Ensure only 3 arguments are passed
  }else{
    const newintent= await intentClassification(userMessage);
    await executeTask(String(newintent.intent).toLowerCase(), userMessage, chatHistory,addToChat,address); // Ensure only 3 arguments are passed
  }
  
  
};
