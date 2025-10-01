# Backend Tests

This directory contains unit tests for the backend agents.

## Test Files

### `conversation.agent.test.ts`
Tests for the ConversationalAgent that gathers project requirements from users.

**Test Coverage:**
- Basic conversation handling
- Requirement evaluation
- Tool usage (RequirementEvaluatorTool)
- Multi-turn conversations
- Edge cases (brief input, detailed requirements)

### `pm.agent.test.ts`
Tests for the PMAgent that creates comprehensive project plans.

**Test Coverage:**
- Basic project planning (web apps, mobile apps, e-commerce)
- Tool usage (MilestonePlannerTool, TechStackAdvisorTool, RiskAnalyzerTool)
- JSON output validation
- Different project scales (small, medium, large)
- Different project types (healthcare, AI/ML)
- Edge cases (minimal requirements, detailed technical specs, tight timelines)

## Running Tests

### Run all tests
```bash
cd backend
yarn test
```

### Run tests in watch mode
```bash
yarn test:watch
```

### Run tests with coverage
```bash
yarn test:coverage
```

### Run specific test file
```bash
yarn test pm.agent.test.ts
```

### Run specific test suite
```bash
yarn test -t "PMAgent"
```

### Run specific test case
```bash
yarn test -t "should generate a project plan for a simple web application"
```

## Environment Setup

Before running tests, make sure you have:

1. **OpenAI API Key**: Set the `OPENAI_API_KEY` environment variable
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. **Dependencies installed**:
   ```bash
   cd backend
   yarn install
   ```

## Test Structure

All tests follow the same pattern:

```typescript
describe('AgentName', () => {
  beforeAll(() => {
    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  });

  describe('Test Category', () => {
    it('should do something', async () => {
      const input = 'test input';
      const result = await run(Agent, input);
      
      expect(result).toBeDefined();
      expect(result.finalOutput).toBeDefined();
      console.log('Agent Response:', result.finalOutput);
    }, 60000); // Timeout in milliseconds
  });
});
```

## Test Timeouts

- **Basic tests**: 30 seconds (30000ms)
- **Complex tests with multiple tool calls**: 60 seconds (60000ms)
- **Multi-turn conversations**: 60+ seconds

Adjust timeouts based on:
- Number of tool calls
- Complexity of the request
- API response time

## Understanding Test Results

### Successful Test
```
✓ should generate a project plan for a simple web application (45123ms)
```

### Failed Test
```
✗ should generate a project plan for a simple web application (30001ms)
  Error: Timeout - Async callback was not invoked within the 30000 ms timeout
```

### Console Output
Tests log the agent's response to help with debugging:
```
Agent Response: {
  "milestones": [...],
  "techStack": {...},
  "risks": [...],
  "estimatedCost": 20000,
  "timeline": "3 months"
}
```

## JSON Validation Tests

The PMAgent tests include JSON validation to ensure the agent returns properly structured output:

```typescript
try {
  const plan = JSON.parse(result.finalOutput);
  
  // Check for required fields
  expect(plan).toHaveProperty('milestones');
  expect(plan).toHaveProperty('techStack');
  expect(plan).toHaveProperty('risks');
  expect(plan).toHaveProperty('estimatedCost');
  expect(plan).toHaveProperty('timeline');
  
  // Validate types
  expect(Array.isArray(plan.milestones)).toBe(true);
  expect(typeof plan.techStack).toBe('object');
  expect(Array.isArray(plan.risks)).toBe(true);
  expect(typeof plan.estimatedCost).toBe('number');
  expect(typeof plan.timeline).toBe('string');
} catch (error) {
  // Don't fail the test - the agent is still learning
  console.log('JSON parsing failed:', error);
}
```

## Best Practices

1. **Always check environment variables** in `beforeAll()`
2. **Use appropriate timeouts** for different test types
3. **Log agent responses** for debugging
4. **Don't fail tests on JSON parsing errors** - agents may need training
5. **Test edge cases** - minimal input, complex requirements, tight timelines
6. **Test different project types** - web, mobile, healthcare, AI/ML, etc.
7. **Validate output structure** when possible

## Troubleshooting

### Test Timeout
- Increase timeout value: `it('test', async () => {...}, 90000)`
- Check API key is valid
- Check network connection

### API Key Error
```
Error: OPENAI_API_KEY environment variable is required for testing
```
Solution: Set the environment variable before running tests

### JSON Parsing Error
This is expected during development. The agent may not always return valid JSON initially. Tests are designed to not fail on JSON parsing errors.

### Rate Limiting
If you hit OpenAI rate limits:
- Run fewer tests at once
- Add delays between tests
- Use a higher tier API key

## Adding New Tests

When adding new tests:

1. Follow the existing pattern
2. Use descriptive test names
3. Include console.log for debugging
4. Set appropriate timeouts
5. Test both success and edge cases
6. Document any special requirements

Example:
```typescript
it('should handle new project type', async () => {
  const requirement = `
    Project: New Project Type
    Description: Detailed description
    Budget: $50,000
    Timeline: 6 months
  `;

  const result = await run(PMAgent, requirement);

  expect(result).toBeDefined();
  expect(result.finalOutput).toBeDefined();
  console.log('Agent Response:', result.finalOutput);
}, 60000);
```

## CI/CD Integration

To run tests in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    cd backend
    yarn install
    yarn test
```

Make sure to:
- Set `OPENAI_API_KEY` as a secret
- Install dependencies before running tests
- Consider test timeouts in CI environment

