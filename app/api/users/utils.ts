import { supabase } from "@/lib/supabaseClient";

export async function getMessages(chatId: number) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

export async function getInjectiveAddress(injectiveAddress: string): Promise<any> {
  const { data, error } = await supabase
    .from("users")
    .select("wallet_address")
    .eq("wallet_address", injectiveAddress)
    .single();

  if (error) {
    console.error("Error fetching injective address:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function createInjectiveIfNotExists(injectiveAddress: string): Promise<any> {
  const { data: existingInjective, error: existingInjectiveError } = await supabase
    .from("users")
    .select("wallet_address")
    .eq("wallet_address", injectiveAddress)
    .single();

  if (existingInjective) {
    return existingInjective;
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ wallet_address: injectiveAddress }]);

  if (error) {
    console.error("Error creating injective:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function sendMessageToDB(chatId: number, senderId: number, message: object) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, sender_id: senderId, message }]);

  if (error) {
    console.error("Error sending message:", error);
    return error;
  }

  return data;
}
