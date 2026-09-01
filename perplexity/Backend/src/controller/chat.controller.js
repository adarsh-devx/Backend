import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

// @desc send message
// @route POST /api/chats/message
// @access Private
export async function sendMessage(req, res) {
  try {
    const { message, image, chat: chatId } = req.body;

    let title = null,
      chat = null;

    const displayMsg = message || (image ? "Image uploaded" : "New message");

    if (!chatId) {
      const initialTitle = displayMsg.length > 30 ? displayMsg.substring(0, 30) + "..." : displayMsg;
      chat = await chatModel.create({
        user: req.user.id,
        title: initialTitle,
      });

      // Background Async Title Generation (Fire-and-forget)
      generateChatTitle(displayMsg).then(async (aiTitle) => {
        if (aiTitle) {
          await chatModel.findByIdAndUpdate(chat._id, { title: aiTitle });
        }
      }).catch((err) => console.error("Background title generation error:", err));
    }

    const activeChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
      chat: activeChatId,
      content: message || "Describe this image",
      image: image || null,
      role: "user",
    });

    const messages = await messageModel.find({ chat: activeChatId });
    
    // Call Gemini with multimodal support
    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: activeChatId,
      content: result,
      role: "ai",
    });

    res.status(201).json({
      title: chat ? chat.title : null,
      chat,
      aiMessage,
      userMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// @desc get all chats
// @route GET /api/chats/
// @access Private
export async function getChats(req, res) {
  try {
    const userId = req.user.id;
    const chats = await chatModel.find({ user: userId });
    res.status(200).json({ message: "chat fetched successfully", chats });
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// @desc get all messages
// @route GET /api/chats/:chatId/messages
// @access Private
export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const messages = await messageModel.find({ chat: chatId });

    res
      .status(200)
      .json({ message: "messages fetched successfully", messages });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// @desc delete chat
// @route DELETE /api/chats/delete/:chatId
// @access Private
export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    await chatModel.deleteOne({ _id: chatId, user: req.user.id });
    await messageModel.deleteMany({ chat: chatId });
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
