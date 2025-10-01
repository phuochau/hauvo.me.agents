import z from "zod";
import { Severity } from "./severity";

export interface ProjectMilestone {
  phase: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
}

export const projectMilestoneSchema = z.object({
  phase: z.string(),
  duration: z.string(),
  deliverables: z.array(z.string()),
  dependencies: z.array(z.string()),
});

export interface ProjectRisk {
  risk: string;
  severity: Severity;
  mitigation: string;
}

export const projectRiskSchema = z.object({
  risk: z.string(),
  severity: z.string(),
  mitigation: z.string(),
});

export interface ProjectTechStack {
  frontend: string;
  backend: string;
  database: string;
  infrastructure: string;
}

export const projectTechStackSchema = z.object({
  frontend: z.string(),
  backend: z.string(),
  database: z.string(),
  infrastructure: z.string(),
});

export interface ProjectPlan {
  milestones: ProjectMilestone[];
  techStack: ProjectTechStack;
  risks: ProjectRisk[];
  estimatedCost: number;
  timeline: string;
}

export const projectPlanSchema = z.object({
  milestones: z.array(projectMilestoneSchema),
  techStack: projectTechStackSchema,
  risks: z.array(projectRiskSchema),
  estimatedCost: z.number(),
  timeline: z.string(),
});