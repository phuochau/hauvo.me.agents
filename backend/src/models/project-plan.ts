export interface ProjectPlan {
  milestones: Milestone[];
  techStack: string;
  risks: string;
  estimatedCost: number;
  timeline: string;
}

export interface Milestone {
  phase: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
}