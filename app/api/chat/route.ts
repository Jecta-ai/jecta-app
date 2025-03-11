import { NextResponse } from "next/server";
import { processAIMessage } from "@/ai/ai";
import { executeTask } from "@/ai/taskRunner";

export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const chatMessages = body.chatHistory || []; // ✅ Preserve previous messages

    // Function to store AI messages with intent
    const newMessages: { sender: string; type: string; text: string; intent: string }[] = [];

    const addToChat = (msg: { sender: string; type: string; text: string; intent: string }) => {
      chatMessages.push(msg);
      newMessages.push(msg); // ✅ Only store new messages for API response
    };

    if (!body.intent) {
      await processAIMessage(body.message, chatMessages, addToChat, body.address);
    } else {
      await executeTask(body.intent, body.message, chatMessages, addToChat, body.address);
    }

    return NextResponse.json({ messages: newMessages }); // ✅ Send only new messages
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}
