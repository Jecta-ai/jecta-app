import axios from "axios";
import { intents } from "./intents";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = process.env.OPENROUTER_URL;
const AI_MODEL = process.env.MODEL;
const CONFIDENCE_THRESHOLD = process.env.CONFIDENCE_THRESHOLD;

export async function intentClassification(userPrompt: string) {
  try {
    const examplesText = Object.entries(intents)
      .map(
        ([intent, data]) =>
          `Intent: ${intent.toUpperCase()} \nDescription: ${
            data.description
          } \nKeywords: ${data.keywords.join(", ")}`
      )
      .join("\n\n");

    if (!OPENROUTER_URL || !CONFIDENCE_THRESHOLD) {
      return;
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: `
                        Your task is to classify the intent of the following user input. 
                        You must respond **strictly** with a JSON object in the format:
                        {"intent": "<detected_intent>", "confidence": <confidence_value>}
                        Do not include any extra text, explanations, or formatting.
                        
                        You are an AI that classifies user intents and extracts transaction details.
                        Available intents: ${Object.keys(intents).join(", ")}
                        
                        Here are the intents with examples:

                        ${examplesText}

                        Extract the intent and a confidence score (0-1).
                        If the confidence is below ${CONFIDENCE_THRESHOLD}, classify it as "default".
                            
                        **IMPORTANT !**
                        **ONLY MAKE YOUR RESPOND AS I INSTRUCTED YOU AS JSON FORMAT WE NEED. DO NOT WRITE ANYTHING ELSE !**`,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.error("Error: AI response is empty or invalid.");
      return { intent: "default", confidence: 0 };
    }

    let aiResponse;

    try {
      aiResponse = JSON.parse(response.data.choices[0].message.content.trim());
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return { intent: "default", confidence: 0 };
    }

    if (!aiResponse.intent || aiResponse.confidence < CONFIDENCE_THRESHOLD) {
      return { intent: "default", confidence: aiResponse.confidence || 0 };
    }

    return aiResponse;
  } catch (error) {
    console.error("Error classifying intent:", error);
    return { intent: "error", confidence: 0 };
  }
}
