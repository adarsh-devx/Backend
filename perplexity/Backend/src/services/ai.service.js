import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage , AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const formattedMessages = messages
    .filter((msg) => msg && msg.content)
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
      return null;
    })
    .filter(Boolean);

  const response = await geminiModel.invoke(formattedMessages);
  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a chat title generator. Generate a concise and descriptive title for the following chat conversation.

    User will provide the first message of the chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant , and engaging, giving users a quick understanding of the chat's topic.
      
      `),
    new HumanMessage(`

      Generate a title for a chat conversation based on the following first message: "${message}"
      
      `),
  ]);
  return response.text;
}
