import { tavily } from '@tavily/core';
import dotenv from "dotenv";
dotenv.config();

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchIntenet = async (query) => {
  try {
    const result = await tavilyClient.search(query, {
      maxResults: 5,
      searchDepth: "basic",
    });
    return JSON.stringify(result);
  } catch (error) {
    console.error("Tavily search error:", error);
    throw error;
  }
};