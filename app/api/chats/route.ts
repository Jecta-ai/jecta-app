import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const injectiveAddress = req.headers.get("injectiveAddress");
  if (!injectiveAddress) {
    return new Response(JSON.stringify({ error: "Missing injectiveAddress" }), { status: 400 });
  }

  const { data: userId, error: userIdError } = await supabase
    .from("users")
    .select("id")
    .eq("wallet_address", injectiveAddress)
    .single();

  if (userIdError) {
    return new Response(JSON.stringify({ error: `userError: ${userIdError.message}` }), {
      status: 500,
    });
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

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", injectiveAddress)
      .single();

    const { data: systemData, error: systemError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", senderId)
      .single();

    if (systemError || userError) {
      return new Response(JSON.stringify({ error: systemError?.message || userError?.message }), {
        status: 500,
      });
    }

    if (!systemData || !systemData.id) {
      return new Response(JSON.stringify({ error: "Sender not found" }), { status: 400 });
    }
    if (!userData || !userData.id) {
      return new Response(JSON.stringify({ error: "Recipient not found" }), { status: 400 });
    }

    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert([{ ai_id: systemData?.id, user_id: userData?.id, title: title }])
      .select()
      .single();

    if (chatError) {
      return new Response(JSON.stringify({ error: chatError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data: chatData }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
