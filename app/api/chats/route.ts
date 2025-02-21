import { supabase } from "@/lib/supabaseClient";

// TODO: Add auth check
export async function GET(req: Request) {
  const injectiveAddress = req.headers.get("injectiveAddress");
  if (!injectiveAddress) {
    return new Response(JSON.stringify({ error: "Missing injectiveAddress" }), { status: 400 });
  }

  const { data: userId, error: userIdError } = await supabase
    .from("injectives")
    .select("id")
    .eq("wallet_address", injectiveAddress)
    .single();

  if (userIdError) {
    return new Response(JSON.stringify({ error: userIdError.message }), { status: 500 });
  }

  const { data, error } = await supabase.from("chats").select("*").eq("user_id", userId?.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { title, injectiveAddress, senderId } = await req.json();

    if (!injectiveAddress || !senderId) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    // Get user2Id from injectives table
    const { data: user2Data, error: user2Error } = await supabase
      .from("injectives")
      .select("id")
      .eq("wallet_address", injectiveAddress)
      .single();

    const { data: user1Data, error: user1Error } = await supabase
      .from("injectives")
      .select("id")
      .eq("wallet_address", senderId)
      .single();

    if (user2Error) {
      return new Response(JSON.stringify({ error: user2Error.message }), { status: 500 });
    }

    if (!user1Data || !user1Data.id) {
      return new Response(JSON.stringify({ error: "Sender not found" }), { status: 400 });
    }
    if (!user2Data || !user2Data.id) {
      return new Response(JSON.stringify({ error: "Recipient not found" }), { status: 400 });
    }

    // Create chat
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert([{ ai_id: user1Data?.id, user_id: user2Data?.id, title: title }])
      .select()
      .single();

    if (chatError) {
      return new Response(JSON.stringify({ error: chatError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data: chatData }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
