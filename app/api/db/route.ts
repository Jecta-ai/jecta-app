import { NextResponse } from "next/server";
import { getMessages, createInjectiveIfNotExists, sendMessageToDB } from "./utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  const messages = await getMessages(Number(chatId));
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    switch (type) {
      case "createInjective": {
        const { injectiveAddress } = data;
        if (!injectiveAddress) {
          return NextResponse.json({ error: "Injective address is required" }, { status: 400 });
        }
        const result = await createInjectiveIfNotExists(injectiveAddress);
        return NextResponse.json(result);
      }

      case "sendMessage": {
        const { chatId, senderId, message } = data;
        if (!chatId || !senderId || !message) {
          return NextResponse.json(
            { error: "ChatId, senderId, and message are required" },
            { status: 400 }
          );
        }
        const result = await sendMessageToDB(Number(chatId), Number(senderId), message);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: "Invalid operation type" }, { status: 400 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
