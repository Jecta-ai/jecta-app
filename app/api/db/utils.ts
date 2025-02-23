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

export async function createInjectiveIfNotExists(injectiveAddress: string) {
  const { data: existingInjective, error: existingInjectiveError } = await supabase
    .from("injectives")
    .select("wallet_address")
    .eq("wallet_address", injectiveAddress)
    .single();

  if (existingInjectiveError && existingInjectiveError.code !== "PGRST116") {
    console.error("Error checking injective existence:", existingInjectiveError);
    return existingInjectiveError;
  }

  if (existingInjectiveError) {
    return existingInjectiveError;
  }

  if (existingInjective) {
    return existingInjective;
  }

  const { data, error } = await supabase
    .from("injectives")
    .insert([{ wallet_address: injectiveAddress }]);

  if (error) {
    console.error("Error creating injective:", error);
    return error;
  }

  return data;
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
