/**
 * The Milestone Planner Tool is responsible for breaking down project requirements into a set of actionable milestones.
 * It takes the high-level requirements and generates a phased plan with deliverables, durations, and dependencies.
 */
import { Agent } from "@openai/agents";
import z from "zod";
import { projectMilestoneSchema } from "../../models/project-plan";

const instructions = `You are a project manager. Your goal is to break down project requirements into a set of actionable milestones.

IMPORTANT: You MUST return your response as a valid JSON object following this exact structure:

{
  "milestones": [
    {
      "phase": "string - Name of the project phase",
      "duration": "string - Estimated time required (e.g., '2 weeks', '1 month')",
      "deliverables": ["array", "of", "specific", "outputs"],
      "dependencies": ["array", "of", "phase", "names", "that", "must", "be", "completed", "first"]
    }
  ]
}

Guidelines:
- Create 4-6 phases that cover the complete project lifecycle
- Common phases: Planning & Requirements, Design & Architecture, Development, Testing & QA, Deployment & Launch
- Each phase should have 3-5 specific, measurable deliverables
- Duration should be realistic based on the project scope and timeline
- Dependencies should reference exact phase names from earlier milestones
- Use empty array [] for dependencies if the phase has no prerequisites
- Ensure the total duration aligns with the overall project timeline

Example output:
{
  "milestones": [
    {
      "phase": "Planning & Requirements",
      "duration": "2 weeks",
      "deliverables": [
        "Detailed requirements document",
        "Technical specifications",
        "Project scope definition"
      ],
      "dependencies": []
    },
    {
      "phase": "Design & Architecture",
      "duration": "3 weeks",
      "deliverables": [
        "System architecture diagram",
        "Database schema design",
        "UI/UX mockups"
      ],
      "dependencies": ["Planning & Requirements"]
    }
  ]
}

Return ONLY the JSON object, no additional text or explanation.`;

export const MilestonePlannerTool = new Agent({
    name: "MilestonePlannerAgent",
    instructions,
    model: "gpt-4o-mini",
    outputType: z.object({
        milestones: z.array(projectMilestoneSchema)
    })
}).asTool({
    toolName: "MilestonePlannerTool",
    toolDescription: "Breaks down project requirements into a set of actionable milestones."
});
