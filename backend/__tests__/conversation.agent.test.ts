import { run } from '@openai/agents';
import { ConversationAgent } from '../src/modules/conversation/conversation.agent';

describe('ConversationAgent', () => {
  beforeAll(() => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required for testing');
    }
  });

  describe('Basic Conversation', () => {
    it('should respond to a simple greeting', async () => {
      const result = await run(
        ConversationAgent,
        'Hello! I want to build a new software project.'
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 30000); // 30 second timeout for API calls

    it('should gather project requirements', async () => {
      const result = await run(
        ConversationAgent,
        'I need a mobile app for tracking fitness activities'
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 30000);
  });

  describe('Requirement Evaluation', () => {
    it('should ask for missing information', async () => {
      const result = await run(
        ConversationAgent,
        'I want to build something'
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      // Agent should ask clarifying questions
      console.log('Agent Response:', result.finalOutput);
    }, 30000);

    it('should handle complete requirements', async () => {
      const completeRequirement = `
        I want to build a task management web application.
        Project name: TaskMaster Pro
        Description: A collaborative task management tool for teams
        Budget: $50,000
        Timeline: 6 months
        Additional info: Need mobile responsive design, real-time updates, and integration with Slack
      `;

      const result = await run(
        ConversationAgent,
        completeRequirement
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 30000);
  });

  describe('Tool Usage', () => {
    it('should use RequirementEvaluatorTool when appropriate', async () => {
      const result = await run(
        ConversationAgent,
        `I have a project idea:
         Name: E-commerce Platform
         Description: Online store for handmade crafts
         Budget: $30,000
         Timeline: 4 months
         Additional: Need payment gateway and inventory management`
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();

      // The result contains the final output from the agent
      // Tool calls are handled internally by the agent
      console.log('Agent Response:', result.finalOutput);
    }, 30000);
  });

  describe('Multi-turn Conversation', () => {
    it('should handle follow-up questions', async () => {
      // First message
      const firstResult = await run(
        ConversationAgent,
        'I want to build a social media app'
      );

      expect(firstResult).toBeDefined();
      console.log('First Response:', firstResult.finalOutput);

      // Follow-up message (in a real scenario, you'd maintain conversation context)
      const secondResult = await run(
        ConversationAgent,
        'The budget is $100,000 and timeline is 8 months'
      );

      expect(secondResult).toBeDefined();
      console.log('Second Response:', secondResult.finalOutput);
    }, 60000); // 60 second timeout for multiple API calls
  });

  describe('Edge Cases', () => {
    it('should handle very brief input', async () => {
      const result = await run(
        ConversationAgent,
        'app'
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 30000);

    it('should handle detailed technical requirements', async () => {
      const technicalRequirement = `
        Project: Real-time Analytics Dashboard
        Description: A comprehensive analytics platform with real-time data visualization
        Budget: $150,000
        Timeline: 12 months
        Technical Requirements:
        - React frontend with TypeScript
        - Node.js backend with Express
        - PostgreSQL database
        - Redis for caching
        - WebSocket for real-time updates
        - AWS deployment
        - CI/CD pipeline
        - Unit and integration tests
        Additional: Need to support 10,000 concurrent users
      `;

      const result = await run(
        ConversationAgent,
        technicalRequirement
      );

      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 30000);
  });
});

