# Agent Flow Architecture

This document explains the multi-agent workflow system for project requirement gathering, planning, evaluation, and summarization.

## Overview

The system consists of four specialized agents coordinated by a central orchestrator:

1. **ConversationalAgent** - Collects project requirements from users
2. **PMAgent** - Expands requirements into detailed project plans
3. **OrchestratorAgent** - Central coordinator that manages all agent interactions
4. **SummarizerAgent** - Generates final project briefs and deliverables

**Key Principle**: All agents communicate exclusively through the OrchestratorAgent. No direct agent-to-agent communication occurs.

## Architecture Diagram

```
                    ┌─────────────────────────────────────┐
                    │      OrchestratorAgent              │
                    │   (Central Coordinator)             │
                    │                                     │
                    │  • Routes requests to agents        │
                    │  • Receives results from agents     │
                    │  • Makes all workflow decisions     │
                    │  • Uses ProjectEvaluatorTool        │
                    └──┬────────┬──────────┬──────────┬───┘
                       │        │          │          │
            ┌──────────┘        │          │          └──────────┐
            │                   │          │                     │
            ▼                   ▼          ▼                     ▼
    ┌───────────────┐   ┌──────────┐  ┌──────────┐   ┌─────────────────┐
    │Conversational │   │ PMAgent  │  │Summarizer│   │ProjectEvaluator │
    │    Agent      │   │          │  │  Agent   │   │      Tool       │
    └───────┬───────┘   └────┬─────┘  └────┬─────┘   └─────────────────┘
            │                │             │
            │ Uses           │ Uses        │ Uses
            ▼                ▼             ▼
    ┌───────────────┐   ┌──────────────────────────┐   ┌─────────────┐
    │Requirement    │   │• MilestonePlannerTool    │   │• EmailTool  │
    │Evaluator Tool │   │• TechStackAdvisorTool    │   │• StorageTool│
    └───────────────┘   │• RiskAnalyzerTool        │   └─────────────┘
                        └──────────────────────────┘

    All results flow back UP to OrchestratorAgent ↑
    OrchestratorAgent decides next step ↓
```

## Agent Details

### 1. ConversationalAgent

**Purpose**: Interacts with users to gather comprehensive project requirements.

**Location**: `backend/src/modules/conversation/`

**Responsibilities**:
- Engage in natural conversation with users
- Ask clarifying questions about project scope, budget, timeline, and goals
- Collect all necessary requirement fields
- Validate completeness before proceeding

**Tools Used**:
- **RequirementEvaluatorTool**: Checks if all required fields are answered clearly
  - Validates: project name, description, budget, timeline, goals, constraints
  - Returns: completeness status and missing fields
  - Triggers: Re-prompting for incomplete information

**Flow**:
```
User Input → OrchestratorAgent → ConversationalAgent
                                         │
                                         ├─ Uses RequirementEvaluatorTool
                                         │
                                         └─ Returns result to OrchestratorAgent
                                                    │
                                                    ├─ Complete? → Route to PMAgent
                                                    └─ Incomplete? → Route back to ConversationalAgent
```

**Key Features**:
- Conversational interface via Socket.IO
- Iterative requirement gathering
- Returns validation status to Orchestrator
- No direct communication with other agents

---

### 2. PMAgent (Project Manager Agent)

**Purpose**: Transforms requirements into detailed project plans.

**Location**: `backend/src/modules/pm/`

**Responsibilities**:
- Break down requirements into actionable milestones
- Recommend appropriate technology stack
- Identify potential risks and mitigation strategies
- Create realistic timelines and resource estimates

**Tools Used**:
- **MilestonePlannerTool**: Generates project milestones and phases
  - Input: Requirements, timeline, scope
  - Output: Phased milestones with deliverables and durations
  
- **TechStackAdvisorTool**: Recommends technology choices
  - Input: Project type, requirements, constraints
  - Output: Frontend, backend, database, and infrastructure recommendations
  
- **RiskAnalyzerTool**: Identifies project risks (optional)
  - Input: Project plan, timeline, budget
  - Output: Risk assessment with mitigation strategies

**Flow**:
```
OrchestratorAgent → PMAgent (receives requirements)
                       │
                       ├─ Uses MilestonePlannerTool
                       ├─ Uses TechStackAdvisorTool
                       ├─ Uses RiskAnalyzerTool
                       │
                       └─ Returns Comprehensive Project Plan
                                    │
                                    ▼
                          OrchestratorAgent (receives plan)
```

**Output Structure**:
```typescript
{
  milestones: [
    {
      phase: string,
      duration: string,
      deliverables: string[],
      dependencies: string[]
    }
  ],
  techStack: {
    frontend: string[],
    backend: string[],
    database: string,
    infrastructure: string[]
  },
  risks: [
    {
      risk: string,
      severity: 'low' | 'medium' | 'high',
      mitigation: string
    }
  ],
  estimatedCost: number,
  timeline: string
}
```

---

### 3. OrchestratorAgent (Manager Agent)

**Purpose**: Central coordinator that manages all agent interactions and workflow decisions.

**Location**: `backend/src/modules/orchestrator/`

**Responsibilities**:
- **Route all requests** to appropriate member agents
- **Receive all results** from member agents
- **Make all workflow decisions** based on agent outputs
- Validate project plan alignment with original requirements
- Enforce business rules and constraints
- Handle feedback loops and re-planning
- Maintain workflow state

**Communication Pattern**:
```
OrchestratorAgent is the ONLY agent that:
  ✓ Sends requests to member agents
  ✓ Receives results from member agents
  ✓ Decides which agent to invoke next

Member agents (Conversational, PM, Summarizer):
  ✓ Receive requests from OrchestratorAgent only
  ✓ Return results to OrchestratorAgent only
  ✗ Never communicate directly with each other
```

**Tools Used**:
- **ProjectEvaluatorTool**: Validates alignment between requirements and plan
  - Checks: Budget alignment, timeline feasibility, scope match
  - Validates: Tech stack appropriateness, resource estimates
  - Returns: Approval status or specific misalignments

**Decision Logic**:
```
1. Receive result from PMAgent
   ↓
2. Use ProjectEvaluatorTool to validate
   ↓
3. Make decision:
   ├─ Aligned? → Route to SummarizerAgent
   │
   └─ Misaligned? → Determine severity
                     │
                     ├─ Minor issues → Route back to PMAgent
                     └─ Major issues → Route back to ConversationalAgent
```

**Example Validation Scenarios**:

✅ **Approved - Route to SummarizerAgent**:
- Budget: $10k, Plan: $9.5k (3 months, 1 developer)
- Timeline: 6 months, Plan: 5.5 months with buffer
- Scope: MVP features, Plan: Core features + testing
- **Action**: OrchestratorAgent routes to SummarizerAgent

❌ **Rejected - Route back to PMAgent**:
- Budget: $5k, Plan: $15k (unrealistic cost estimate)
- Timeline: 2 months, Plan: 8 months (scope too large)
- **Action**: OrchestratorAgent sends feedback to PMAgent to revise

❌ **Rejected - Route back to ConversationalAgent**:
- Requirements unclear or contradictory
- Missing critical information discovered during planning
- **Action**: OrchestratorAgent routes to ConversationalAgent to clarify

**Key Features**:
- **Central hub** for all agent communication
- Intelligent routing between agents
- Validation with business logic
- Feedback loop management
- State tracking across workflow
- Decision-making authority

---

### 4. SummarizerAgent

**Purpose**: Generates polished, professional project briefs and handles deliverables.

**Location**: `backend/src/modules/summarizer/`

**Responsibilities**:
- Compile all information into a cohesive project brief
- Format output for stakeholder consumption
- Send notifications and store artifacts
- Generate final documentation

**Tools Used**:
- **EmailTool**: Sends project brief to stakeholders
  - Input: Recipients, subject, formatted brief
  - Output: Delivery confirmation
  
- **StorageTool**: Persists project data
  - Input: Project brief, metadata
  - Output: Storage location, document ID

**Output Format**:
```markdown
# Project Brief: [Project Name]

## Executive Summary
[High-level overview]

## Requirements
- **Budget**: $X
- **Timeline**: Y months
- **Goals**: [Key objectives]

## Project Plan

### Milestones
1. Phase 1: [Details]
2. Phase 2: [Details]
...

### Technology Stack
- **Frontend**: [Technologies]
- **Backend**: [Technologies]
- **Database**: [Technology]
- **Infrastructure**: [Technologies]

### Risk Assessment
| Risk | Severity | Mitigation |
|------|----------|------------|
| ...  | ...      | ...        |

## Resource Estimates
- **Cost**: $X
- **Duration**: Y months
- **Team Size**: Z developers

## Next Steps
[Action items]
```

---

## Workflow Sequence

### Happy Path

```
1. User starts conversation
   ↓
2. OrchestratorAgent routes to ConversationalAgent
   ↓
3. ConversationalAgent gathers requirements
   ├─ Uses RequirementEvaluatorTool
   └─ Returns result to OrchestratorAgent
   ↓
4. OrchestratorAgent receives complete requirements
   └─ Routes to PMAgent
   ↓
5. PMAgent creates project plan
   ├─ Uses MilestonePlannerTool
   ├─ Uses TechStackAdvisorTool
   ├─ Uses RiskAnalyzerTool
   └─ Returns plan to OrchestratorAgent
   ↓
6. OrchestratorAgent validates plan
   ├─ Uses ProjectEvaluatorTool
   └─ Plan approved ✓
   ↓
7. OrchestratorAgent routes to SummarizerAgent
   ↓
8. SummarizerAgent generates brief
   ├─ Uses EmailTool
   ├─ Uses StorageTool
   └─ Returns confirmation to OrchestratorAgent
   ↓
9. OrchestratorAgent marks workflow complete
```

### Feedback Loop Example

```
1. User: "I need a mobile app, budget $1k, timeline 1 month"
   ↓
2. OrchestratorAgent → ConversationalAgent
   ↓
3. ConversationalAgent collects details
   └─ Returns to OrchestratorAgent
   ↓
4. OrchestratorAgent → PMAgent
   ↓
5. PMAgent creates plan:
   - Cost estimate: $15k
   - Timeline: 6 months
   - Team: 2 developers
   └─ Returns plan to OrchestratorAgent
   ↓
6. OrchestratorAgent uses ProjectEvaluatorTool:
   ❌ Budget: $1k vs $15k (15x over)
   ❌ Timeline: 1 month vs 6 months (6x over)
   ↓
7. OrchestratorAgent decides: Route back to ConversationalAgent
   ↓
8. OrchestratorAgent → ConversationalAgent (with feedback):
   "Your requirements may not be feasible. Would you like to:
    a) Increase budget to $15k
    b) Extend timeline to 6 months
    c) Reduce scope to MVP features
    d) Reconsider the project"
   ↓
9. ConversationalAgent collects updated requirements
   └─ Returns to OrchestratorAgent
   ↓
10. OrchestratorAgent → PMAgent (with updated requirements)
    └─ Workflow continues...
```

---

## Module Structure

```
backend/src/modules/
├── conversation/
│   ├── conversation.agent.ts          # Main conversational agent
│   ├── conversation.socket.ts         # Socket.IO handlers
│   ├── conversation.tool.ts           # Conversation utilities
│   └── requirement-evaluator.tool.ts  # Requirement validation
│
├── pm/
│   ├── pm.agent.ts                    # Project manager agent
│   ├── pm.socket.ts                   # Socket.IO handlers
│   ├── milestone-planner.tool.ts      # Milestone generation
│   ├── techstack-advisor.tool.ts      # Tech recommendations
│   └── risk-analyzer.tool.ts          # Risk assessment
│
├── orchestrator/
│   ├── orchestrator.agent.ts          # Workflow coordinator
│   ├── orchestrator.socket.ts         # Socket.IO handlers
│   └── project-evaluator.tool.ts      # Plan validation
│
├── summarizer/
│   ├── summarizer.agent.ts            # Brief generation
│   └── summarize.socket.ts            # Socket.IO handlers
│
└── shared/
    ├── email.tool.ts                  # Email notifications
    └── storage.tool.ts                # Data persistence
```

---

## Communication Protocol

All communication flows through the **OrchestratorAgent** via **Socket.IO**.

### Communication Rules

1. **Client ↔ OrchestratorAgent**: Direct communication via Socket.IO
2. **OrchestratorAgent ↔ Member Agents**: Internal function calls
3. **Member Agents ↔ Member Agents**: ❌ NOT ALLOWED (must go through Orchestrator)

### Event Structure

```typescript
// Client → OrchestratorAgent
{
  event: 'workflow:start',
  data: {
    userInput: string,
    sessionId: string
  }
}

// OrchestratorAgent → Client (Progress Updates)
{
  event: 'workflow:progress',
  data: {
    currentAgent: 'conversation' | 'pm' | 'summarizer',
    status: 'processing' | 'complete' | 'error',
    message: string,
    result?: any
  }
}

// OrchestratorAgent → Client (Final Result)
{
  event: 'workflow:complete',
  data: {
    status: 'success' | 'error',
    projectBrief: any,
    metadata: {
      totalDuration: number,
      agentsInvoked: string[]
    }
  }
}
```

### Internal Agent Communication

```typescript
// OrchestratorAgent → Member Agent (Internal)
interface AgentRequest {
  agentType: 'conversation' | 'pm' | 'summarizer',
  action: string,
  payload: any,
  context: {
    sessionId: string,
    previousResults?: any
  }
}

// Member Agent → OrchestratorAgent (Internal)
interface AgentResponse {
  status: 'success' | 'error' | 'needs_input',
  result: any,
  metadata?: {
    toolsUsed: string[],
    duration: number
  }
}
```

---

## Implementation Guidelines

### Adding a New Agent

1. Create agent directory under `backend/src/modules/`
2. Implement agent class extending base agent
3. Define tools in separate files
4. **Register with OrchestratorAgent** - Add routing logic
5. Ensure agent returns results to Orchestrator (not other agents)
6. Update this README

### Adding a New Tool

1. Create tool file in appropriate module
2. Define tool schema with Zod
3. Implement tool logic
4. Register with agent (not Orchestrator)
5. Add to documentation

### Key Design Principles

1. **Single Point of Control**: OrchestratorAgent is the only decision-maker
2. **No Direct Communication**: Member agents never call each other
3. **Return, Don't Route**: Member agents return results, don't route to next agent
4. **Stateless Agents**: Member agents don't maintain workflow state
5. **Orchestrator Owns State**: Only OrchestratorAgent tracks workflow progress

### Testing Strategy

- **Unit Tests**: Individual tools and agents in isolation
- **Integration Tests**: OrchestratorAgent routing logic
- **E2E Tests**: Complete user journeys through Orchestrator
- **Validation Tests**: ProjectEvaluatorTool and RequirementEvaluatorTool
- **Communication Tests**: Verify no direct agent-to-agent calls

---

## Future Enhancements

- [ ] Add DeveloperAgent for code generation
- [ ] Implement DesignerAgent for UI/UX planning
- [ ] Add QAAgent for test plan generation
- [ ] Support multi-language requirements
- [ ] Add cost estimation refinement
- [ ] Implement project template library
- [ ] Add integration with project management tools

---

## References

- OpenAI Agents SDK: `@openai/agents`
- Socket.IO Documentation: https://socket.io/docs/
- Zod Schema Validation: https://zod.dev/

