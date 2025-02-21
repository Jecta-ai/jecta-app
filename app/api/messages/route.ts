import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const chatId = req.url.split("/").pop();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .filter("chat_id", "eq", chatId);

  if (error) {
    console.error("Error fetching messages:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}

export async function POST(req: Request) {
  const { chatId, senderId, message } = await req.json();

  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, sender_id: senderId, message }]);

  if (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}
