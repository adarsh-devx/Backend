import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { searchIntenet } from "./internet.service.js";

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(
  async ({ query }) => {
    return await searchIntenet(query);
  },
  {
    name: "search_internet",
    description: "Search the internet for real-time information",
    schema: z.object({
      query: z.string().describe("The query to search for"),
    }),
  }
);

const modelWithTools = mistralModel.bindTools([searchInternetTool]);

export async function generateResponse(messages) {
  // Take last 10 messages to keep context fast and lightweight
  const recentMessages = messages.slice(-10);

  const formattedMessages = recentMessages
    .filter((msg) => msg && (msg.content || msg.image))
    .map((msg, index) => {
      const isLatestUserMsg = index === recentMessages.length - 1;
      
      if (msg.role === "user") {
        if (msg.image && isLatestUserMsg) {
          return new HumanMessage({
            content: [
              { type: "text", text: msg.content || "Describe or analyze this image." },
              {
                type: "image_url",
                image_url: {
                  url: msg.image,
                },
              },
            ],
          });
        }
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
      return null;
    })
    .filter(Boolean);

  let response = await modelWithTools.invoke(formattedMessages);

  // If Mistral decides to invoke the search_internet tool
  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolCall = response.tool_calls[0];
    if (toolCall.name === "search_internet") {
      const searchResult = await searchInternetTool.invoke(toolCall.args);
      
      formattedMessages.push(response);
      formattedMessages.push(
        new ToolMessage({
          content: typeof searchResult === "string" ? searchResult : JSON.stringify(searchResult),
          tool_call_id: toolCall.id,
        })
      );

      // Call model again with the search results to get final answer
      response = await mistralModel.invoke(formattedMessages);
    }
  }

  return response.content || response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a chat title generator. Generate a concise and descriptive title for the following chat conversation. User will provide the first message of the chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words.`),
    new HumanMessage(`Generate a title for a chat conversation based on the following first message: "${message}"`),
  ]);
  return response.text;
}
