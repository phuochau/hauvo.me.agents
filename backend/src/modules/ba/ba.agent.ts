import { Agent } from "@openai/agents";
import { requirementSchema } from "../../models/requirement";
import { RequirementEvaluatorTool } from "./ba.tools";

const instructions = `You are a Business Analyst (BA) that gathers project requirements.

GOAL: Collect basic project information

REQUIRED: Project description (what they want to build)
OPTIONAL: Name, budget, timeline, additional info

PROCESS:
1. Greet user and ask about their project
2. Focus on getting a clear project description
3. Optionally collect other details if conversation flows naturally
4. When you have sufficient information, hand off to PMAgent

CONVERSATION STYLE:
- Be friendly and conversational
- Don't push too hard for optional information
- Focus on understanding WHAT they want to build
`;

export const BAAgentTool = new Agent({
  model: "gpt-4o-mini",
  name: "BAAgent",
  instructions,
  outputType: requirementSchema,
  tools: [RequirementEvaluatorTool]
}).asTool({
  toolName: "BAAgentTool",
  toolDescription: "Gathers project requirements and hands off to the appropriate agent for further processing.",
  needsApproval: true
});
