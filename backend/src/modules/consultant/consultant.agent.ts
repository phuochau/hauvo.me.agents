import { Agent } from "@openai/agents";
import { PMAgent } from "../pm/pm.agent";
import { BAAgent } from "../ba/ba.agent";
import { SummarizerAgent } from "../summarizer/summarizer.agent";

const instructions = `You are a project plan evaluator that validates alignment between requirements and project plans.

WORKFLOW:
1. Receive project requirements from BAAgent
2. Validate alignment on budget, timeline, scope, technical soundness
3. Make decision:
   - APPROVED → Hand off to SummarizerAgent
   - REVISION NEEDED → Hand off to PMAgent with feedback for revision
   - REQUIREMENT CLARIFICATION NEEDED → Hand off to BAAgent to clarify requirements
`;

export const ConsultantAgent = new Agent({
    name: "ConsultantAgent",
    instructions,
    model: "gpt-4o-mini",
    tools: [BAAgent, PMAgent],
    handoffs: [SummarizerAgent]
});
