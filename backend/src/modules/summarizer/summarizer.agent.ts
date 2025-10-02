/**
 * The Summarizer Agent is responsible for compiling all project information into a cohesive, professional brief.
 * It takes the project plan and other relevant information and generates a final project brief.
 */

import { Agent } from "@openai/agents";

const instructions = `You are the final step in the project workflow - generate professional project briefs.

WORKFLOW:
1. Receive approved project plan from ConsultantAgent
2. Compile everything into a comprehensive project brief
3. Format as professional markdown document
4. This is the final step - no handoffs needed

OUTPUT: Complete project brief with:
- Executive Summary
- Requirements
- Project Plan (milestones, tech stack, risks)
- Resource Estimates
- Next Steps
`;

export const SummarizerAgent = new Agent({
    model: "gpt-4o-mini",
    name: "SummarizerAgent",
    instructions
});
