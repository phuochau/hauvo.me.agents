# PROJECT CONSULT AGENT

The idea that I would like to demo how we can design an agent by using OpenAI Agents SDK. We can do the same architecture by using LangGraph, CrewAI, AutoGen, etc

## HOW TO RUN
- Configure OPENAI_API_KEY in .env file
- Run `npm install`
- Run `npm run console` to go to the interactive mode

## Sub-Agents and Tools
- **ConsultantAgent**: Main orchestrator that routes requests and optimizes workflow
- **BAAgent**: Business Analyst for requirements gathering with quick analysis capabilities
- **PMAgent**: Project Manager that creates comprehensive plans with parallel analysis
- **SummarizerAgent**: Final step that compiles everything into a professional brief

## Techniques
In this demo, we have some techniques such as:
- Agent & Tools
- Agent as Tool
- Handoffs
- Evaluator

## Enhancements
We can do more enhancements such as:
- GuardRails (e.g: maximum timeline, min & max budget, etc)
- Stream: we can stream messages for the user so it's more friendly and the user can know which is happening
- UI & UX: we can build a beautiful frontend to interact with the express backend via websocket
- Collect the client details and send confirmation email, etc

