import z from "zod";

export interface Requirement {
  name: string;
  description: string;
  budget: number;
  timeline: string;
  additionalInfo: string;
}

export const requirementSchema = z.object({
  name: z.string(),
  description: z.string(),
  budget: z.number(),
  timeline: z.string(),
  additionalInfo: z.string(),
});

export interface RequirementValidationResult {
  isComplete: boolean;
  needsImprovement: boolean;
  missingFields: string[];
  incompleteFields: string[];
  feedback: string[];
  requirement: Requirement;
  nextAction: 'proceed_to_planning' | 'gather_more_info';
}