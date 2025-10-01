import { run } from '@openai/agents';
import { ConversationAgent } from '../conversation.agent';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Example: Running ConversationAgent with Tracing
 * 
 * This script demonstrates how to run the ConversationAgent with automatic tracing.
 * Tracing is enabled by default, so you don't need any special configuration.
 * 
 * After running this script, you can view the trace in the OpenAI dashboard:
 * https://platform.openai.com/traces
 */

async function main() {
  console.log('🚀 Starting ConversationAgent with Tracing...\n');

  // Check if API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
    console.error('Please set it in your .env file:');
    console.error('OPENAI_API_KEY=sk-your-api-key-here');
    process.exit(1);
  }

  try {
    // Example 1: Simple greeting
    console.log('📝 Example 1: Simple Greeting');
    console.log('Input: "Hello! I want to build a new software project."\n');

    const result1 = await run(
      ConversationAgent,
      'Hello! I want to build a new software project.'
    );

    console.log('✅ Agent Response:');
    console.log(result1.finalOutput);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Detailed requirements
    console.log('📝 Example 2: Detailed Requirements');
    const detailedInput = `
      I want to build a task management application.
      Project name: TaskFlow
      Description: A collaborative task management tool for remote teams
      Budget: $75,000
      Timeline: 8 months
      Additional info: Need real-time collaboration, mobile apps, and Slack integration
    `;
    console.log('Input:', detailedInput.trim(), '\n');

    const result2 = await run(
      ConversationAgent,
      detailedInput
    );

    console.log('✅ Agent Response:');
    console.log(result2.finalOutput);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: Incomplete requirements
    console.log('📝 Example 3: Incomplete Requirements');
    console.log('Input: "I need a mobile app"\n');

    const result3 = await run(
      ConversationAgent,
      'I need a mobile app'
    );

    console.log('✅ Agent Response:');
    console.log(result3.finalOutput);
    console.log('\n' + '='.repeat(80) + '\n');

    // Summary
    console.log('🎉 All examples completed successfully!\n');
    console.log('📊 View your traces in the OpenAI dashboard:');
    console.log('   https://platform.openai.com/traces\n');
    console.log('Look for traces with workflow name "Agent workflow"\n');

  } catch (error) {
    console.error('❌ Error running agent:', error);
    process.exit(1);
  }
}

// Run the main function
main();

