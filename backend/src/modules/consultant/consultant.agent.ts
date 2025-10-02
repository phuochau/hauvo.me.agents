import { Agent } from "@openai/agents";
import { PMAgentTool } from "../pm/pm.agent";
import { BAAgentTool } from "../ba/ba.agent";
import { SummarizerAgent } from "../summarizer/summarizer.agent";

const instructions = `You're a project consultant.

GOAL: Help users with their project requests.

PROCESS:
1. Receive requirements from user
2. Brainstorming requirements to make it more clear and detailed.
3. Confirm the requirements with the user.
4. Revise the requirements if needed.
5. Decide which agent to use based on the request
6. Hand off to the appropriate agent
7. Return the result to the user
`;

export const ConsultantAgent = new Agent({
    name: "ConsultantAgent",
    instructions,
    model: "gpt-4o-mini",
    tools: [BAAgentTool, PMAgentTool],
    handoffs: [SummarizerAgent]
});
