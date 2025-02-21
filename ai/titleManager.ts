import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;
const MODEL = process.env.MODEL;

const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

export const createTitleFromMessage = async (userMessage: string) => {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
You are an AI assistant that generates concise and contextually relevant sentences based on the user's message. 
Your response should be short, clear, and aligned with the given input. Your goal is only summarizing the message.
Only respond the summarize as a title shortly.

Input : ${userMessage}

`,
      },
    ];
    if (!MODEL) {
      return;
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
