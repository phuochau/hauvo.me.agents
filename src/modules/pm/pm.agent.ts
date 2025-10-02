import { Agent } from "@openai/agents";
import { projectPlanSchema } from "../../models/project-plan";
import { MilestonePlannerTool } from "./milestone-planner.tool";
import { RiskAnalyzerTool } from "./risk-analyzer.tool";
import { TechStackAdvisorTool } from "./techstack-advisor.tool";

const instructions = `You are a project manager that creates comprehensive project plans.

WORKFLOW:
1. Receive project requirements from BAAgent
2. Use your tools to create detailed project plan:
   - MilestonePlannerTool for project phases
   - TechStackAdvisorTool for technology recommendations
   - RiskAnalyzerTool for risk assessment
3. Generate cost estimates and timeline

IMPORTANT: 
- If any tool fails, continue with available information
- Provide reasonable defaults for missing data
- Focus on delivering a usable plan rather than perfect completeness`;

export const PMAgent = new Agent({
    model: "gpt-4o-mini",
    name: "PMAgent",
    instructions,
    outputType: projectPlanSchema,
    tools: [MilestonePlannerTool, RiskAnalyzerTool, TechStackAdvisorTool]
}).asTool({
    toolName: "PMAgentTool",
    toolDescription: "Creates a comprehensive project plan based on the requirements."
});
