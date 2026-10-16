import { HumanMessage } from "@langchain/core/messages";
import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { mistralModel, cohereModel, geminiModel } from "./models.service.js";
import { createAgent, providerStrategy } from "langchain";
import { z } from "zod";

const State = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  judge_recommendation: new ReducedValue(
    z
      .object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
      })
      .default({
        solution_1_score: 0,
        solution_2_score: 0,
      }),
    {
      reducer: (current, next) => {
        return next;
      },
    },
  ),
});

const solutionNode = async (state: typeof State.State) => {
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(state.messages),
    cohereModel.invoke(state.messages),
  ]);

  return {
    solution_1:
      typeof mistral_solution.content === "string"
        ? mistral_solution.content
        : JSON.stringify(mistral_solution.content),
    solution_2:
      typeof cohere_solution.content === "string"
        ? cohere_solution.content
        : JSON.stringify(cohere_solution.content),
  };
};

const judgeNode = async (state: typeof State.State) => {
  const { solution_1, solution_2 } = state;

  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
      }),
    ),
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
    Here is the original question asked by the user
    ${state.messages.at(-1)?.content}

    Here is the solution provided by the first model (Mistral)
    ${solution_1}

    Here is the solution provided by the second model (Cohere)
    ${solution_2}

    Your job is to evaluate which solution is better and provide a score to both. 
    Score should be between 0 and 10.
    10 means best and 0 means worst.
    `),
    ],
  });


  const result = judgeResponse.structuredResponse

  return{
    judge_recommendation: result
  }
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

export default async function (userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  console.log(result);

  return result.messages;
}
