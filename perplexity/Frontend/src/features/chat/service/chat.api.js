import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});




export async function sendMessage({ message, chatId }) {
  try {
    const response = await api.post("/api/chats/message", {
      message,
      chat: chatId,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting message:", error);
    throw error;
  }
}

export async function getChats() {
  try {
    const response = await api.get("/api/chats");
    return response.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
}

export async function getMessages(chatId) {
  try {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}


export async function deleteChat(chatId) {
  try {
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}
