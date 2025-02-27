import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { address } = await req.json();
  const nonce = uuidv4();
  const { data, error } = await supabase
    .from("users")
    .select("nonce")
    .eq("wallet_address", address)
    .single();

  if (data) {
    const { data: updatedData, error: updateError } = await supabase
      .from("users")
      .update({
        nonce: nonce,
      })
      .match({
        wallet_address: address,
      });
  } else {
    const { data: newData, error: newError } = await supabase.from("users").insert({
      wallet_address: address,
      nonce: nonce,
    });
  }

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ nonce: nonce }), { status: 200 });
}
