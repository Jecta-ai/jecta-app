const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Default to localhost if not set

const getLastChatNames = async (injectiveAddress: string) => {
  const response = await fetch(`${baseUrl}/api/chats`, {
    method: "GET",
    headers: { "Content-Type": "application/json", injectiveAddress: injectiveAddress },
  });
  const data = await response.json();
  return data.data;
};

const getChatHistory = async (chatId: string) => {
  const response = await fetch(`${baseUrl}/api/chats/${chatId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data;
};

export { getLastChatNames, getChatHistory };
