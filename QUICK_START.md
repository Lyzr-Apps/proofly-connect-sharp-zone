# Proofly Platform - Quick Start Guide

## What Was Built

A complete trust-based skill verification platform with:
- 8 AI agents for task generation, monitoring, evaluation, and trust scoring
- 12 fully functional screens covering student, company, and recruiter workflows
- Fairness-first design with human-in-loop decision making
- Public skill receipts as verifiable credentials

---

## Getting Started

### 1. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

### 2. Navigate the Platform

Use the **Role Switcher** (top-right) to explore different user perspectives:

**Student Role:**
- Dashboard - See your trust score, portfolio, and notifications
- Tasks - Browse and start unique task variants
- Trust Center - Track improvements and view history

**Company Role:**
- Review - Evaluate submissions with full behavioral context
- Create Task - Build new tasks with fairness guidelines

**Recruiter Role:**
- Compare - View candidate portfolios side-by-side

---

## Key Features to Test

### Student Journey
1. Browse tasks in Task Marketplace
2. Start a task and see the monitoring context bar (transparent)
3. Submit work
4. If anomalies detected, see the "Explain Your Process" modal (non-accusatory)
5. View your skill receipt (public, shareable)
6. Check trust score improvements

### Company Review
1. Open Review Dashboard
2. See fairness reminder banner
3. Review behavioral context (labeled "CONTEXT - NOT JUDGMENT")
4. Read student's workflow explanation
5. Make decision with justification
6. Try negative action - see 3-pattern requirement enforced

### Public Credentials
1. Navigate to a skill receipt (public view)
2. Notice only positive badges shown (Verified Independent Work / With Assistance)
3. Test social sharing buttons (LinkedIn, Twitter, Copy, Embed)
4. View verification hash and QR code

---

## Agent Integration

All screens currently use **mock data**. To connect live agents:

### Example: Generate Task Variant

**Current (Mock):**
```typescript
const mockVariant = {
  variant_id: '7842',
  task_title: 'Data Pipeline Challenge',
  parameters: { dataset: 'sales_2024.csv' }
}
```

**Replace with Live Agent:**
```typescript
import { callAIAgent } from '@/lib/aiAgent'

const result = await callAIAgent(
  'Generate a unique variant for Data Pipeline Challenge for student 12345',
  '698592afe5d25ce3f598cb71' // Task Variant Generator ID
)

if (result.success) {
  const variant = result.response.result
  console.log(variant.variant_id)
  console.log(variant.parameters)
}
```

### All Agent IDs

```typescript
const AGENTS = {
  TASK_VARIANT: '698592afe5d25ce3f598cb71',
  SESSION_MONITOR: '698592c7e17e33c11eed1a75',
  EVALUATION_MANAGER: '698592e0fe576c19864be864',
  FAIRNESS_GUARDIAN: '698592fcf7f7d3ffa5d86538',
  REVIEW_ASSISTANT: '698593191caa4e686dd66f21',
  TRUST_SCORE: '69859337a791e6e318b8df57',
  RECEIPT_GENERATOR: '69859356fe576c19864be875',
  DEFENSE_COORDINATOR: '69859377fe576c19864be878',
}
```

---

## Design System

### Colors
- **Primary (Navy):** `#0F172A`
- **Trust Green:** `#10B981` - Verified states
- **Soft Blue:** `#3B82F6` - Info/pending
- **Amber:** `#F59E0B` - Attention needed
- **Coral:** `#EF4444` - Errors only

### Language Guidelines
Always use fairness-forward language:
- "Needs Context" NOT "Suspicious"
- "Highlighted for Review" NOT "Flagged"
- "Adjustment" NOT "Penalty"

---

## File Structure

```
/app
  page.tsx                 - Main application (all 12 screens)
  layout.tsx               - Root layout
  /api/agent/route.ts      - Agent API handler

/lib
  aiAgent.ts               - AI integration utility

/types
  index.ts                 - TypeScript interfaces

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

/components/ui             - Shadcn UI components

workflow.json              - Complete workflow definition
PROOFLY_SYSTEM_COMPLETE.md - Full documentation
```

---

## Critical Reminders

### USE aiAgent.ts for ALL AI Calls
```typescript
import { callAIAgent } from '@/lib/aiAgent'

// Call any agent
const result = await callAIAgent(message, agentId, options)

// Or use the hook
import { useAIAgent } from '@/lib/aiAgent'
const { callAgent, loading, error } = useAIAgent()
```

### Clean JSON Parsing
All agent responses follow this structure:
```typescript
{
  success: boolean
  response: {
    status: 'success' | 'error'
    result: { ...actualData }
    message?: string
  }
}
```

Always check `success` and `status` before accessing `result`.

### No Toast/Sonner
Use inline notifications instead:
```typescript
{notificationVisible && (
  <Alert>
    <AlertDescription>Success message here</AlertDescription>
  </Alert>
)}
```

---

## Testing Checklist

- [ ] Run development server
- [ ] Test role switcher (Student/Company/Recruiter)
- [ ] Navigate all 12 screens
- [ ] Verify design system colors
- [ ] Check fairness-forward language
- [ ] Test modals (Explain Process, Negative Action)
- [ ] Review agent IDs in code
- [ ] Verify aiAgent.ts integration
- [ ] Check TypeScript interfaces in /types
- [ ] Review test responses in /response_schemas

---

## Next Steps

1. **Connect Live Agents:** Replace mock data with `callAIAgent()` calls
2. **Add Real Data:** Set up database/API for storing submissions, receipts, etc.
3. **Video Integration:** Implement real-time video for oral defense sessions
4. **Code Editor:** Add live code editor with syntax highlighting
5. **Analytics:** Build company analytics dashboard
6. **Mobile:** Optimize responsive design for mobile task execution

---

## Support

**Documentation:**
- Full system docs: `PROOFLY_SYSTEM_COMPLETE.md`
- Agent details: `PROOFLY_AGENT_SYSTEM.md`
- Workflow: `workflow.json`

**Key Concepts:**
- Fairness-first: No automated negative impacts
- Human-in-loop: All decisions require human review
- 3+ pattern rule: Minimum 3 confirmed issues before trust reduction
- Oral defense: Students can always upgrade verification
- Public positivity: Only positive badges on public receipts

---

## Development Commands

```bash
# Run dev server
npm run dev

# Type checking (DO NOT run build - forbidden in requirements)
npx tsc --noEmit

# Format code
npm run format
```

---

**Built by Architect, powered by Lyzr AI Agent Platform**

Ready to help students build verified skill portfolios with fairness and transparency!
