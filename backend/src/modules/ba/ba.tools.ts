import { tool } from "@openai/agents";
import z from "zod";
import { requirementOutputSchema, RequirementValidationResult } from "../../models/requirement";

export const RequirementEvaluatorTool = tool({
  name: "RequirementEvaluatorTool",
  description: 'Evaluates requirement completeness and quality. Returns validation status and specific feedback for missing or unclear fields.',
  parameters: z.object({
    requirement: requirementOutputSchema,
  }),
  execute: async (input): Promise<RequirementValidationResult> => {
    try {
      const { requirement } = input;
      const missingFields: string[] = [];
      const feedback: string[] = [];

      // Only check description as required - be very lenient
      if (!requirement.description || requirement.description.trim().length < 10) {
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
    } catch (error) {
      console.error('Error in RequirementEvaluatorTool:', error);
      // Return a safe default
      return {
        isComplete: false,
        needsImprovement: false,
        missingFields: ['description'],
        incompleteFields: [],
        feedback: ['Please provide a project description'],
        requirement: input.requirement,
        nextAction: 'gather_more_info'
      };
    }
  },
});
