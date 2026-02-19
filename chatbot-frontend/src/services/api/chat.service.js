import api from "./axios";

// Send message to AI chatbot
export const sendMessageToAI = async (message) => {
  const response = await api.post("/chat", { message });
  return response.data;
};

// Get chat history
export const getChatHistory = async () => {
  const response = await api.get("/chat");
  return response.data;
};

