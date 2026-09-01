import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../service/chat.socket";
import {
  getChats,
  getMessages,
  sendMessage as apiSendMessage,
  deleteChat as apiDeleteChat,
} from "../service/chat.api";
import {
  setChats,
  setActiveChatId,
  setLoading,
  setError,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, loading, error } = useSelector(
    (state) => state.chat
  );

  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Initialize Socket Connection
  useEffect(() => {
    initializeSocketConnection();
  }, []);

  // Fetch all chats using Redux dispatch
  const loadChats = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await getChats();
      if (data && data.chats) {
        // Convert array of chats to key-value object map if chats is {}
        const chatsMap = {};
        data.chats.forEach((c) => {
          chatsMap[c._id] = c;
        });
        dispatch(setChats(chatsMap));
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load messages when activeChatId changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setIsMessagesLoading(true);
      try {
        const data = await getMessages(activeChatId);
        if (data && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeChatId]);

  // Send message using Redux dispatch for chat updates
  const handleSendMessage = async (inputMessage) => {
    if (!inputMessage || !inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setIsSending(true);

    // Optimistically add user message to feed
    const tempUserMsg = {
      _id: "temp-" + Date.now(),
      role: "user",
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await apiSendMessage({
        message: userText,
        chatId: activeChatId,
      });

      if (res) {
        // If it's a new chat created
        if (!activeChatId && res.chat) {
          dispatch(setActiveChatId(res.chat._id));
        }

        // Reload chats in Redux store
        loadChats();

        // Update messages feed
        if (res.userMessage && res.aiMessage) {
          setMessages((prev) => {
            const filtered = prev.filter((m) => !m._id.startsWith("temp-"));
            return [...filtered, res.userMessage, res.aiMessage];
          });
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      dispatch(setError(err.message));
    } finally {
      setIsSending(false);
    }
  };

  // Select a chat
  const handleSelectChat = (chatId) => {
    dispatch(setActiveChatId(chatId));
  };

  // Create new chat
  const handleCreateNewChat = () => {
    dispatch(setActiveChatId(null));
    setMessages([]);
  };

  // Delete chat
  const handleDeleteChat = async (chatId, e) => {
    if (e) e.stopPropagation();
    try {
      await apiDeleteChat(chatId);
      if (activeChatId === chatId) {
        handleCreateNewChat();
      }
      loadChats();
    } catch (err) {
      console.error("Failed to delete chat:", err);
      dispatch(setError(err.message));
    }
  };

  // Convert chats object map back to array for component rendering
  const chatsList = Array.isArray(chats)
    ? chats
    : Object.values(chats || {});

  return {
    chats: chatsList,
    activeChatId,
    messages,
    isChatsLoading: loading,
    isMessagesLoading,
    isSending,
    error,
    handleSendMessage,
    handleSelectChat,
    handleCreateNewChat,
    handleDeleteChat,
    loadChats,
  };
};
