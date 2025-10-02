import { Agent } from "@openai/agents";
import { MilestonePlannerTool } from "./milestone-planner.tool";
import { TechStackAdvisorTool } from "./techstack-advisor.tool";
import { RiskAnalyzerTool } from "./risk-analyzer.tool";
import { projectPlanSchema } from "../../models/project-plan";

const instructions = `You are a project manager that creates comprehensive project plans.

WORKFLOW:
1. Receive project requirements from BAAgent
2. Use your tools to create detailed project plan:
   - MilestonePlannerTool for project phases
   - TechStackAdvisorTool for technology recommendations
   - RiskAnalyzerTool for risk assessment
3. Generate cost estimates and timeline

OUTPUT FORMAT: Return structured JSON with:
- milestones, techStack, risks, estimatedCost, timeline
`;


export const PMAgent = new Agent({
    model: "gpt-4o-mini",
    name: "PMAgent",
    instructions,
    outputType: projectPlanSchema,
    tools: [
        MilestonePlannerTool,
        TechStackAdvisorTool,
        RiskAnalyzerTool
    ]
}).asTool({
    toolName: "PMAgentTool",
    toolDescription: "Creates a comprehensive project plan based on the requirements."
});
