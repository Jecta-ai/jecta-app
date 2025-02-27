// Use for secure token storage

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // Default to localhost if not set

// Get token from cookies (preferred) or localStorage
const getAuthToken = () =>  localStorage.getItem("token");

// ✅ Get last chat names with JWT Authentication
const getLastChatNames = async (injectiveAddress: string) => {
  const token = getAuthToken();

  const response = await fetch(`${baseUrl}/api/chats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Attach JWT
      InjectiveAddress: injectiveAddress, // Keep injective address if needed
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch chat names: ${response.status}`);
  const data = await response.json();
  return data.data;
};

// ✅ Get chat history with JWT Authentication
const getChatHistory = async (chatId: string) => {
  const token = getAuthToken();

  const response = await fetch(`${baseUrl}/api/chats/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "", // Attach JWT
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch chat history: ${response.status}`);
  const data = await response.json();
  return data;
};

export { getLastChatNames, getChatHistory };
