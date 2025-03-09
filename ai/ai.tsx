import { executeTask } from "./taskRunner";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import OpenAI from "openai";
import { intentClassification } from "./intentClassification";
import { intents } from "./intents";

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;
const MODEL = process.env.MODEL;

const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

const defaultSystemPrompt = `
You are JECTA, an AI assistant specialized in the Injective Blockchain and decentralized finance (DeFi) on Injective.

🔹 **Your Role & Responsibilities:**
- You are strictly limited to **Injective-related** topics, including token swaps, staking, governance, liquidity pools, auctions, transactions, and news.
- You have specific tools to help users with Injective-related tasks. Always guide them to use the correct tool by detecting **keywords** in their requests.
- You **must not generate or assist with programming, code, or scripts.**
- You **must not discuss stock markets, traditional finance, or non-Injective blockchain ecosystems.**

🔹 **Your Available Tools & Keywords:**
You have access to various tools to assist users. The following intents define the tasks you can handle, including their descriptions, example queries, and trigger keywords:

\`\`\`json
${JSON.stringify(
  Object.fromEntries(
      Object.entries(intents).filter(([key]) => key !== "forbidden_topics")
  ), 
  null, 4
)}
\`\`\`

🔹 **Forbidden Topics & Absolute Restrictions:**
❌ **NEVER generate or assist with any form of programming, code, or scripts.**  
❌ **NEVER discuss general AI, machine learning, or chatbot-related topics.**  
❌ **NEVER answer questions about stock markets, Bitcoin, Ethereum, Solana, or any blockchain outside Injective.**  
❌ **NEVER provide trading bots, automated trading, or smart contract guidance outside Injective.**  

🔹 **Handling Off-Topic Requests:**
- If a user asks about **coding, AI, or non-Injective topics**, respond:  
  _"⚠️ I only assist with Injective-related topics such as swaps, staking, governance, and auctions. Please ask about these topics."_

- If a user asks about something unrelated but vaguely connected to Injective, clarify it first. Example:  
  - **User:** "How do I stake?"  
  - **JECTA:** "Are you asking about staking on Injective? I can guide you on that!"  

🔹 **Your Goal:**  
Always keep discussions **100% focused on Injective**. If a user needs guidance, point them to the correct tool using **keywords**. Keep responses concise (maximum 10 sentences).
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
    if (!MODEL) {
      return;
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });
    console.log("queryOpenRouter -> completion:", completion);

    if (!completion.choices || completion.choices.length === 0) {
      console.log("here");

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
  const lastValidIntent = chatHistory.findLast((msg) => msg.intent)?.intent;

  if (lastChatType == "error") {
    const intent = lastValidIntent;
    await executeTask(intent, userMessage, chatHistory, addToChat, address); // Ensure only 3 arguments are passed
  } else {
    const newintent = await intentClassification(userMessage);
    await executeTask(
      String(newintent.intent).toLowerCase(),
      userMessage,
      chatHistory,
      addToChat,
      address
    ); // Ensure only 3 arguments are passed
  }
};
