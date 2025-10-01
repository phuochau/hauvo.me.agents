import { tool } from "@openai/agents";
import z from "zod";
import { requirementSchema, RequirementValidationResult } from "../../models/requirement";


export const RequirementEvaluatorTool = tool({
  name: "RequirementEvaluatorTool",
  description: 'Evaluates requirement completeness and quality. Returns validation status and specific feedback for missing or unclear fields.',
  parameters: z.object({
    requirement: requirementSchema,
  }),
  execute: async (input): Promise<RequirementValidationResult> => {
    const { requirement } = input;
    const missingFields: string[] = [];
    const feedback: string[] = [];

    // Only check description as required - be very lenient
    if (!requirement.description || requirement.description.trim().length < 5) {
      missingFields.push("description");
      feedback.push("Please provide a brief description of what you want to build");
    }

    console.log('Requirement:', requirement);
    console.log('Missing Fields:', missingFields);

    const isComplete = missingFields.length === 0;

    // Very low bar - just need any description
    const canProceed = isComplete;

    return {
      isComplete: canProceed,
      needsImprovement: false, // Don't ask for improvements in demo
      missingFields,
      incompleteFields: [],
      feedback,
      requirement,
      nextAction: canProceed ? 'proceed_to_planning' : 'gather_more_info'
    };
  },
});
