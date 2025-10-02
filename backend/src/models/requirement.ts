import z from "zod";

export interface Requirement {
  name?: string;
  description: string;
  budget?: number;
  timeline?: string;
  additionalInfo?: string;
}

export const requirementInputSchema = z.object({
  name: z.string().optional(),
  description: z.string().min(10, "Description should be at least 10 characters"),
  budget: z.number().optional(),
  timeline: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const requirementOutputSchema = z.object({
  description: z.string().min(10, "Description should be at least 10 characters"),
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
