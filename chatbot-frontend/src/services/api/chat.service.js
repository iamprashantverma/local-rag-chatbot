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

// Send text to server
export const updateDocs = async (data) => {
  console.log(data);
  const response = await api.post("/docs/update",  data );
  return response.data;
};

// Upload .txt or .pdf files (form data)
export const uploadDocs = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post("/docs/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return response.data;
};
