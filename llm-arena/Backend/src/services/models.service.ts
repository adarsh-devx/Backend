import { ChatGoogle } from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai"
import {ChatCohere} from "@langchain/cohere"
import config from "../config/config.js";


/** Model ids — single source of truth for construction *and* API labels. */
export const MISTRAL_MODEL_ID = "open-mistral-7b";
export const COHERE_MODEL_ID = "command-r-plus-08-2024";

/** Human-readable provider labels sent to API consumers (shown in the UI). */
export const MISTRAL_PROVIDER_LABEL = `Mistral (${MISTRAL_MODEL_ID})`;
export const COHERE_PROVIDER_LABEL = `Cohere (${COHERE_MODEL_ID})`;

export const geminiModel = new ChatGoogle({
    model:"gemini-flash-latest", 
    apiKey:config.GEMINI_API_KEY
})


export const mistralModel = new ChatMistralAI({
    model: MISTRAL_MODEL_ID, 
    apiKey: config.MISTRAL_API_KEY
})


export const cohereModel = new ChatCohere({
    model: COHERE_MODEL_ID, 
    apiKey: config.COHERE_API_KEY
})

