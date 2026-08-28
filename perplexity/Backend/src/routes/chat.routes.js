import { Router } from "express";
import { sendMessage, getChats,getMessages , deleteChat } from "../controller/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const chatRouter = Router();



// @desc send message
// @route POST /api/chats/message
// @access Private
chatRouter.post("/message", authMiddleware, sendMessage);


// @desc get all chats
// @route GET /api/chats/
// @access Private
chatRouter.get("/", authMiddleware, getChats);


// @desc get all messages
// @route GET /api/chats/:chatId/messages
// @access Private
chatRouter.get("/:chatId/messages",authMiddleware, getMessages);

// @desc delete chat
// @route DELETE /api/chats/delete/:chatId
// @access Private
chatRouter.delete("/delete/:chatId",authMiddleware,deleteChat);

export default chatRouter;
