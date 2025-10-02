import { Agent } from "@openai/agents";
import { PMAgent } from "../pm/pm.agent";
import { BAAgent } from "../ba/ba.agent";
import { SummarizerAgent } from "../summarizer/summarizer.agent";

const instructions = `You're a project consultant.

GOAL: Help users with their project requests.

PROCESS:
1. Receive requirements from user
2. Brainstorming requirements to make it more clear and detailed.
3. Confirm the requirements with the user.
4. Decide which agent to use based on the request.
5. Hand off to the appropriate agent
6. Return the result to the user.
7. If the user confirmed, please hand off to the SummarizerAgent to generate a final project brief.

IMPORTANT:
- If agents fail or timeout, provide a helpful response based on available information
- Don't get stuck waiting for perfect responses
- Focus on delivering value to the user`;

export const ConsultantAgent = new Agent({
    name: "ConsultantAgent",
    instructions,
    model: "gpt-4o-mini",
    tools: [BAAgent, PMAgent],
    handoffs: [SummarizerAgent]
});
