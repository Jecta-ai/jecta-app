import { supabase } from "@/lib/supabaseClient";

// TODO: Add auth check
export async function GET(req: Request, { params }: { params: Promise<{ chatId: string }> }) {
  const chatId = (await params).chatId;

  const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
