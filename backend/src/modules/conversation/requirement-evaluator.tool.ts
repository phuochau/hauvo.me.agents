import { tool } from "@openai/agents";
import z from "zod";

const requirementSchema = z.object({
  name: z.string(),
  description: z.string(),
  budget: z.number(),
  timeline: z.string(),
  additionalInfo: z.string(),
});

const instruction = `Evaluates requirement completeness and quality. Returns validation status and specific feedback for missing or unclear fields.`

export const RequirementEvaluatorTool = tool({
  name: "RequirementEvaluatorTool",
  description: instruction,
  parameters: z.object({
    requirement: requirementSchema,
  }),
  execute: async (input) => {
    const { requirement } = input;
    const missingFields: string[] = [];
    const incompleteFields: string[] = [];
    const feedback: string[] = [];

    // Check for missing or empty fields
    if (!requirement.name || requirement.name.trim().length < 3) {
      missingFields.push("name");
      feedback.push("Project name should be descriptive and at least 3 characters");
    }

    if (!requirement.description || requirement.description.trim().length < 20) {
      missingFields.push("description");
      feedback.push("Project description should be detailed (at least 20 characters) explaining the purpose and key features");
    }

    if (!requirement.budget || requirement.budget <= 0) {
      missingFields.push("budget");
      feedback.push("Budget must be a positive number representing the total project cost");
    }

    if (!requirement.timeline || requirement.timeline.trim().length < 3) {
      missingFields.push("timeline");
      feedback.push("Timeline should specify duration (e.g., '3 months', '6 weeks')");
    }

    // Check for quality issues
    if (requirement.description && requirement.description.length < 50) {
      incompleteFields.push("description");
      feedback.push("Description could be more detailed - consider adding target audience, key features, or technical requirements");
    }

    if (requirement.budget && requirement.budget < 1000) {
      incompleteFields.push("budget");
      feedback.push("Budget seems low - please confirm this is realistic for your project scope");
    }

    const isComplete = missingFields.length === 0;
    const needsImprovement = incompleteFields.length > 0;

    return {
      isComplete,
      needsImprovement,
      missingFields,
      incompleteFields,
      feedback,
      requirement,
      nextAction: isComplete ? "proceed_to_planning" : "gather_more_info"
    };
  },
});
