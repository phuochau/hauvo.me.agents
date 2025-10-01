import { tool } from "@openai/agents";
import z from "zod";

export const AskNameTool = tool({
  name: "AskNameTool",
  description: "Ask for project name",
  parameters: z.object({
    name: z.string()
  }),
  execute: async (input) => {
    // Implement conversation logic here
    console.log(input)
    return {
      field: 'name',
      value: input.name,
      nextField: 'description'
    };
  },
});

export const AskDescriptionTool = tool({
  name: "AskDescriptionTool",
  description: "Ask for project description",
  parameters: z.object({
    description: z.string()
  }),
  execute: async (input) => {
    return {
      field: 'description',
      value: input.description,
      nextField: 'budget'
    };
  },
});

export const ASkBudgetTool = tool({
  name: "AskBudgetTool",
  description: "Ask for project budget",
  parameters: z.object({
    budget: z.number()
  }),
  execute: async (input) => {
    return {
      field: 'budget',
      value: input.budget,
      nextField: 'timeline'
    };
  },
});

export const AskTimelineTool = tool({
  name: "AskTimelineTool",
  description: "Ask for project timeline",
  parameters: z.object({
    timeline: z.string()
  }),
  execute: async (input) => {
    return {
      field: 'timeline',
      value: input.timeline,
      nextField: 'additionalInfo'
    };
  },
});

export const AskAdditionalInfoTool = tool({
  name: "AskAdditionalInfoTool",
  description: "Ask for additional information",
  parameters: z.object({
    additionalInfo: z.string()
  }),
  execute: async (input) => {
    return {
      field: 'additionalInfo',
      value: input.additionalInfo,
      nextField: null
    };
  },
});
