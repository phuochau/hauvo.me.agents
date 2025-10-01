require('dotenv/config');

import * as readline from 'readline';
import { run, withTrace } from "@openai/agents";
import { ConsultantAgent } from "./modules/consultant/consultant.agent";

// ANSI color codes for better console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    red: '\x1b[31m',
};

// Helper function to print colored output
function print(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

// Helper function to print section headers
function printHeader(title: string) {
    console.log('\n' + '='.repeat(80));
    print(title, colors.bright + colors.cyan);
    console.log('='.repeat(80) + '\n');
}

// Helper function to print agent responses
function printAgentResponse(response: any) {
    printHeader('Agent Response');

    if (typeof response === 'string') {
        print(response, colors.green);
    } else if (typeof response === 'object') {
        try {
            print(JSON.stringify(response, null, 2), colors.green);
        } catch (e) {
            print(String(response), colors.green);
        }
    } else {
        print(String(response), colors.green);
    }

    console.log('\n');
}

// Interactive mode
async function interactiveMode() {
    printHeader('🤖 AI Agent Console - Interactive Mode');
    print('Welcome to the Project Consultant Agent!', colors.bright);
    print('This agent will help you gather requirements and create a project plan.\n', colors.dim);
    print('Commands:', colors.yellow);
    print('  - Type your message to interact with the agent', colors.dim);
    print('  - Type "exit" or "quit" to end the session', colors.dim);
    print('  - Type "help" for more information', colors.dim);
    print('  - Type "clear" to clear the screen\n', colors.dim);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `${colors.blue}You: ${colors.reset}`
    });

    let conversationHistory: string[] = [];

    rl.prompt();

    rl.on('line', async (input: string) => {
        const trimmedInput = input.trim();

        // Handle special commands
        if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
            print('\nThank you for using the Project Consultant Agent! Goodbye! 👋', colors.cyan);
            rl.close();
            process.exit(0);
        }

        if (trimmedInput.toLowerCase() === 'help') {
            printHeader('Help');
            print('This is an interactive console for testing the multi-agent workflow.', colors.dim);
            print('\nThe agent system will:', colors.yellow);
            print('  1. Gather your project requirements through conversation (BAAgent)', colors.dim);
            print('  2. Create a detailed project plan with milestones and tech stack (PMAgent)', colors.dim);
            print('  3. Validate the plan against your requirements (ConsultantAgent)', colors.dim);
            print('  4. Generate a final project brief (SummarizerAgent)\n', colors.dim);
            print('Example prompts:', colors.yellow);
            print('  - "I want to build a mobile app for fitness tracking"', colors.dim);
            print('  - "I need an e-commerce website with a budget of $50,000"', colors.dim);
            print('  - "Create a task management system for my team"\n', colors.dim);
            rl.prompt();
            return;
        }

        if (trimmedInput.toLowerCase() === 'clear') {
            console.clear();
            printHeader('🤖 AI Agent Console - Interactive Mode');
            rl.prompt();
            return;
        }

        if (!trimmedInput) {
            rl.prompt();
            return;
        }

        // Add user input to history
        conversationHistory.push(`User: ${trimmedInput}`);

        try {
            print('\n⏳ Processing your request...\n', colors.yellow);

            // Run the agent with tracing
            const result = await withTrace("ProjectConsultant", () => {
                return run(ConsultantAgent, trimmedInput);
            });

            // Display the response
            if (result && result.finalOutput) {
                conversationHistory.push(`Agent: ${result.finalOutput}`);
                printAgentResponse(result.finalOutput);
            } else {
                print('⚠️  No response received from agent', colors.red);
            }

        } catch (error: any) {
            print(`\n❌ Error: ${error.message}`, colors.red);
            if (error.stack) {
                print(`\nStack trace:\n${error.stack}`, colors.dim);
            }
        }

        rl.prompt();
    });

    rl.on('close', () => {
        print('\nSession ended. Goodbye! 👋', colors.cyan);
        process.exit(0);
    });
}

// Quick test mode (non-interactive)
async function quickTestMode() {
    printHeader('🤖 AI Agent Console - Quick Test Mode');

    const testMessage = "Hello! I want to build a new software project.";
    print(`Testing with message: "${testMessage}"\n`, colors.yellow);

    try {
        print('⏳ Processing...\n', colors.yellow);

        const result = await withTrace("ProjectConsultant", () => {
            return run(ConsultantAgent, testMessage);
        });

        if (result && result.finalOutput) {
            printAgentResponse(result.finalOutput);
        } else {
            print('⚠️  No response received from agent', colors.red);
        }

        print('✅ Test completed successfully!', colors.green);
    } catch (error: any) {
        print(`\n❌ Error: ${error.message}`, colors.red);
        if (error.stack) {
            print(`\nStack trace:\n${error.stack}`, colors.dim);
        }
        process.exit(1);
    }
}

// Main execution
const args = process.argv.slice(2);
const mode = args[0] || 'interactive';

if (mode === 'quick' || mode === 'test') {
    quickTestMode().then(() => {
        print('\nExiting...', colors.dim);
        process.exit(0);
    });
} else {
    interactiveMode();
}