import api from "./axios";

export const sendMessageToAI = async (message, controller) => {
  const response = await api.post(
    "/chat",
    { message },
    { signal: controller.signal } 
  );
  return response.data;
};

// Get chat history
export const getChatHistory = async () => {
  const response = await api.get("/chat");
  return response.data;
};

