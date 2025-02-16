import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { injectiveAddress, senderId } = await req.json();

    console.log("POST -> senderId:", senderId);
    console.log("POST -> injectiveAddress:", injectiveAddress);
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

    console.log("POST -> user2Data:", user2Data);
    console.log("POST -> user2Error:", user2Error);
    console.log("POST -> user1Data:", user1Data);
    console.log("POST -> user1Error:", user1Error);

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
      .insert([{ user1_id: user1Data?.id, user2_id: user2Data?.id }])
      .select()
      .single();

    console.log("POST -> chatData:", chatData);
    console.log("POST -> chatError:", chatError);

    if (chatError) {
      return new Response(JSON.stringify({ error: chatError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data: chatData }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
