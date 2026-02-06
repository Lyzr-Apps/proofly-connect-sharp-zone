# Proofly - Trust-Based Skill Verification Platform

A complete, production-ready skill verification platform built with Next.js, React, TypeScript, and Tailwind CSS. Featuring fairness-first design, transparent monitoring, and verifiable skill credentials.

## Features

### Core Platform Capabilities

**For Students:**
- Complete unique task variants with transparent monitoring
- Build verified skill portfolios with permanent receipts
- Track trust scores with improvement-focused guidance
- Oral defense opportunities for authenticity upgrades
- Public, shareable skill credentials

**For Companies:**
- Review submissions with full behavioral context
- Fair decision-making with human-in-loop safeguards
- Create dynamic tasks with unique variants
- Fairness reminders and 3+ pattern requirements

**For Recruiters:**
- Compare candidates by verified achievements
- View skill progression and portfolio highlights
- Access verifiable credentials with cryptographic proof

### Technical Features

- 8 specialized AI agents for task generation, monitoring, and evaluation
- 12 complete screens covering all user workflows
- Fairness-first architecture with ethical AI usage
- Clean TypeScript interfaces with type safety
- Responsive design with mobile support
- Production states (loading, empty, error, success)
- No toast/sonner dependencies (inline notifications)
- OAuth integration ready (no sign-in screens needed)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) in your browser.

### Project Structure

```
/app
  page.tsx                 - Main application (2,316 lines)
  layout.tsx               - Root layout with metadata
  globals.css              - Global styles with Proofly colors
  /api
    /agent/route.ts        - Agent API handler

/components
  /ui                      - Shadcn UI components
  IframeLoggerInit.tsx     - Logging component

/lib
  aiAgent.ts               - AI agent integration utility
  utils.ts                 - Utility functions

/types
  index.ts                 - TypeScript type definitions

/response_schemas
  /test_results            - Actual agent test responses
    task_variant_generator_test_result.json
    session_monitor_test_result.json
    evaluation_manager_test_result.json
    fairness_guardian_test_result.json
    review_assistant_test_result.json
    trust_score_calculator_test_result.json
    receipt_generator_test_result.json
    defense_coordinator_test_result.json

workflow.json              - Complete workflow definition
workflow_state.json        - Agent IDs and status
```

## Application Screens

### 1. Student Dashboard
**Route:** Student role, Dashboard view
**Features:**
- Circular trust score widget (0-100 scale)
- Portfolio highlights with recent receipts
- Quick stats: tasks completed, approval rate, top skills
- Notification panel for approvals and feedback
- Action items for pending explanations

### 2. Task Marketplace
**Route:** Student role, Tasks view
**Features:**
- Filter sidebar (skills, difficulty, time, company)
- Task card grid with unique variant badges
- Search with autocomplete
- Empty states with helpful guidance
- Eligibility notices

### 3. Task Execution Environment
**Route:** Started from Task Marketplace
**Features:**
- Split-view layout: Instructions (35%) | Workspace (65%)
- Transparent monitoring context bar
- Timer display (active vs thinking time)
- Workspace tabs: Browser IDE | File Upload | GitHub Link
- Execution log and workflow tips

### 4. Explain Your Process Modal
**Triggered:** When anomalies detected
**Features:**
- Non-accusatory header: "Help Us Understand Your Workflow"
- Highlighted observations with neutral language
- Textarea with helpful prompts
- Reassurance messaging

### 5. Company Review Dashboard
**Route:** Company role, Review view
**Features:**
- Candidate queue (30%) | Detail view (70%)
- Fairness reminder banner
- Behavior context panel (labeled "CONTEXT - NOT JUDGMENT")
- Student explanations prominently displayed
- Decision panel with justification requirements

### 6. Negative Action Confirmation Modal
**Triggered:** When negative decision attempted
**Features:**
- Impact preview (exact trust score change)
- Pattern requirement check (3+ minimum)
- Student context summary
- Mandatory justification textarea
- Appeal rights information (48 hours)

### 7. Oral Defense Session
**Route:** Defense session view
**Features:**
- Video feed (60%) | Interaction panel (40%)
- Code reference with line numbers
- Conversation guide with suggested topics
- Live collaboration area
- Success outcomes display

### 8. Skill Receipt (Public)
**Route:** Receipt view (shareable)
**Features:**
- Certificate-style layout
- Authenticity badges (positive states only)
- Verification footer with hash and QR code
- Social share bar: LinkedIn, Twitter, Copy, Embed, PDF
- Defense upgrade indicator

### 9. Public Portfolio
**Route:** Portfolio view (shareable)
**Features:**
- Profile header with verification badge
- Tabbed content: Overview | Receipts | Skills | Timeline
- Skill radar chart and progression charts
- Receipt grid with filters

### 10. Trust & Improvement Center
**Route:** Student role, Trust view
**Features:**
- Large circular trust score display
- Score breakdown with contributing factors
- Improvement pathways with projected impact
- History timeline
- Pending items and appeal section

### 11. Company Task Creation
**Route:** Company role, Create Task view
**Features:**
- 5-step wizard: Basics, Requirements, Parameters, Criteria, Guidelines
- Dynamic parameter randomization
- Fairness checklist
- Preview mode

### 12. Recruiter Comparison View
**Route:** Recruiter role, Compare view
**Features:**
- Multi-column comparison table
- Candidate selection (add by URL or search)
- Filter controls
- Quick portfolio preview on hover
- Export comparison

## AI Agent Integration

### Agent IDs

```typescript
const AGENT_IDS = {
  TASK_VARIANT_GENERATOR: '698592afe5d25ce3f598cb71',
  SESSION_MONITOR: '698592c7e17e33c11eed1a75',
  EVALUATION_MANAGER: '698592e0fe576c19864be864',
  FAIRNESS_GUARDIAN: '698592fcf7f7d3ffa5d86538',
  REVIEW_ASSISTANT: '698593191caa4e686dd66f21',
  TRUST_SCORE_CALCULATOR: '69859337a791e6e318b8df57',
  RECEIPT_GENERATOR: '69859356fe576c19864be875',
  DEFENSE_COORDINATOR: '69859377fe576c19864be878',
}
```

### Using the AI Agent Utility

```typescript
import { callAIAgent } from '@/lib/aiAgent'

// Call an agent
const result = await callAIAgent(
  'Generate a unique variant for Data Pipeline Challenge',
  AGENT_IDS.TASK_VARIANT_GENERATOR
)

if (result.success) {
  const variant = result.response.result
  console.log(variant.variant_id)
}
```

### Using the React Hook

```typescript
import { useAIAgent } from '@/lib/aiAgent'

function MyComponent() {
  const { callAgent, loading, error, response } = useAIAgent()

  const handleGenerate = async () => {
    const result = await callAgent(
      'Generate variant...',
      AGENT_IDS.TASK_VARIANT_GENERATOR
    )
  }

  return (
    <button onClick={handleGenerate} disabled={loading}>
      Generate Variant
    </button>
  )
}
```

## Design System

### Color Palette

```css
--proofly-navy: #0F172A;           /* Primary */
--proofly-slate: #334155;          /* Secondary */
--proofly-trust-green: #10B981;    /* Verified states */
--proofly-info-blue: #3B82F6;      /* Info/pending */
--proofly-attention-amber: #F59E0B; /* Attention needed */
--proofly-error-coral: #EF4444;    /* Errors only */
```

### Fairness-Forward Language

Always use positive, neutral language:
- "Needs Context" NOT "Suspicious"
- "Highlighted for Review" NOT "Flagged"
- "Adjustment" NOT "Penalty"
- "CONTEXT - NOT JUDGMENT" for behavioral observations

### Custom Utility Classes

```css
.trust-score-circle    /* Circular trust score display */
.receipt-card          /* Skill receipt card styling */
.fairness-banner       /* Fairness reminder banner */
.context-panel         /* Behavioral context panel */
```

## User Journey Example

1. Student signs up → Trust score starts at 70 ("Good")
2. Browses Python tasks → Filters by difficulty
3. Selects "Data Pipeline Challenge"
4. Sees unique variant badge → Variant #7842 assigned
5. Starts task → Monitoring context bar appears (transparent)
6. Works 45 minutes → Session Monitor logs behavior
7. Submits solution → Anomaly detected (large paste)
8. "Explain Your Process" modal appears
9. Student explains: "I coded in VS Code locally, then pasted"
10. Evaluation Manager analyzes → Quality: 86/100
11. Reviewer sees full context + explanation + fairness reminder
12. Approves as "Verified Independent Work"
13. Receipt generates with green verification badge
14. Student shares to LinkedIn
15. Recruiter discovers → Views verified receipt
16. Clicks "View Full Portfolio" → Sees 5 receipts, 100% verified
17. Adds to shortlist → Begins interview

## Key Principles

### Fairness First
- No automated negative trust impacts
- Human-in-loop for all decisions
- 3+ pattern requirement enforced
- Mandatory justifications
- 48-hour appeal window

### Transparent Monitoring
- Visible context bar explaining what's logged
- Students can explain workflow before judgment
- Behavioral observations, not accusations
- Neutral, descriptive language

### Improvement Focus
- Trust scores show improvement paths
- Projected impact for each action
- Oral defense upgrade opportunities
- Constructive feedback always

### Public Positivity
- Only positive badges on public receipts
- No negative states displayed publicly
- Verification without judgment

## Development Commands

```bash
# Run development server
npm run dev

# Type checking (DO NOT run build per requirements)
npx tsc --noEmit

# Lint code
npm run lint
```

## Production Deployment

The application is production-ready with:
- Complete TypeScript type safety
- Error boundaries and error states
- Loading states with skeleton loaders
- Empty states with helpful guidance
- Success confirmations
- Inline notifications (no toast library)
- Responsive design
- Accessibility features

## Support & Documentation

- **Full System Docs:** `PROOFLY_SYSTEM_COMPLETE.md`
- **Agent Details:** `PROOFLY_AGENT_SYSTEM.md`
- **Quick Start:** `QUICK_START.md`
- **Workflow:** `workflow.json`

## Tech Stack

- **Framework:** Next.js 14
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI + Radix UI
- **Icons:** React Icons (react-icons/fi)
- **AI Integration:** Lyzr AI Agent Platform
- **State Management:** React Hooks

## License

Built with the Lyzr AI Agent Platform.

---

**Ready to help students build verified skill portfolios with fairness and transparency!**
