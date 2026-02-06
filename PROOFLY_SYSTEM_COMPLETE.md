# Proofly Trust-Based Skill Verification Platform

## System Overview

Complete Next.js application implementing a fairness-first skill verification platform where students complete unique task variants, companies review with full behavioral context, and verifiable skill receipts serve as permanent credentials.

---

## Architecture

### Multi-Agent System (8 Specialized Agents)

#### 1. Task Variant Generator
**Agent ID:** `698592afe5d25ce3f598cb71`
**Purpose:** Generate unique task variants with personalized parameters
**Key Fields:** variant_id, parameters, difficulty_level, uniqueness_hash

#### 2. Session Monitor
**Agent ID:** `698592c7e17e33c11eed1a75`
**Purpose:** Gather behavioral context during task execution (transparent, non-judgmental)
**Key Fields:** behavioral_context, keystroke_patterns, timing_analysis, transparency_note

#### 3. Evaluation Manager
**Agent ID:** `698592e0fe576c19864be864`
**Purpose:** Coordinate comprehensive submission evaluation
**Key Fields:** technical_analysis, behavioral_context_summary, similarity_analysis, routing_decision

#### 4. Fairness Guardian
**Agent ID:** `698592fcf7f7d3ffa5d86538`
**Purpose:** Enforce ethics rules and 3+ pattern requirement before negative actions
**Key Fields:** fairness_check, pattern_count, meets_3_pattern_requirement, student_rights_protected

#### 5. Review Assistant
**Agent ID:** `698593191caa4e686dd66f21`
**Purpose:** Help companies make fair review decisions with full context
**Key Fields:** review_package, student_explanation, fairness_reminders, recommended_actions

#### 6. Trust Score Calculator
**Agent ID:** `69859337a791e6e318b8df57`
**Purpose:** Calculate improvement-focused trust scores (0-100)
**Key Fields:** trust_score, score_level, contributing_factors, improvement_pathways

#### 7. Receipt Generator
**Agent ID:** `69859356fe576c19864be875`
**Purpose:** Create verified skill credentials in shareable formats
**Key Fields:** receipt_id, skill_credential, verification_hash, shareable_formats

#### 8. Defense Coordinator
**Agent ID:** `69859377fe576c19864be878`
**Purpose:** Coordinate oral defense sessions for authenticity upgrades
**Key Fields:** defense_session_id, session_details, defense_outcome, verification_upgrade

---

## Application Structure

### All 12 Screens Implemented

#### Student Screens
1. **Dashboard** (`/student/dashboard`)
   - Trust Score Widget (circular 0-100, trend, level)
   - Portfolio highlights with recent receipts
   - Quick actions and notifications

2. **Task Marketplace** (`/student/tasks`)
   - Filter sidebar (skills, difficulty, company)
   - Task grid with unique variant badges
   - Search with autocomplete

3. **Task Execution** (`/student/task/[id]`)
   - Split view: Instructions (35%) | Workspace (65%)
   - Transparent monitoring context bar
   - Timer (active vs thinking time)
   - Workspace tabs: IDE | Upload | GitHub

4. **Trust & Improvement Center** (`/student/trust`)
   - Score breakdown with contributing factors
   - Improvement pathways with projected impact
   - History timeline, pending items, appeals

#### Company Screens
5. **Review Dashboard** (`/company/review`)
   - Candidate queue (30%) | Detail view (70%)
   - Fairness reminder banner
   - Behavior context panel (labeled "CONTEXT - NOT JUDGMENT")
   - Student explanations prominently displayed
   - Decision options with required justifications

6. **Task Creation** (`/company/create-task`)
   - 5-step wizard with fairness checklist
   - Dynamic parameter randomization
   - Rubric builder
   - Preview mode

#### Recruiter Screen
7. **Comparison View** (`/recruiter/compare`)
   - Multi-column candidate comparison
   - Skill match indicators
   - Portfolio quick-preview on hover

#### Defense Screen
8. **Oral Defense Session** (`/defense/[sessionId]`)
   - Video feed (60%) | Interaction panel (40%)
   - Code reference with line numbers
   - Live collaboration area
   - Success outcomes display

#### Public Screens
9. **Skill Receipt** (`/receipt/[id]`)
   - Certificate-style layout
   - Only positive badges (Verified Independent Work | Verified with Assistance)
   - Social sharing (LinkedIn, Twitter, Copy, Embed, PDF)
   - Verification footer with hash and QR code

10. **Portfolio** (`/portfolio/[studentId]`)
    - Profile header with verification badge
    - Tabs: Overview | Receipts | Skills | Timeline
    - Skill radar chart, progression charts

#### Modal Components
11. **Explain Your Process Modal**
    - Triggered when anomalies detected
    - Neutral, non-accusatory language
    - Highlighted observations with context prompts

12. **Negative Action Confirmation Modal**
    - Shows exact trust impact
    - Pattern requirement check (3+ minimum)
    - Mandatory justification
    - Appeal rights (48 hours)

---

## Design System

### Colors
- **Primary:** Deep Navy `#0F172A`
- **Secondary:** Slate Gray `#334155`
- **Trust Green:** `#10B981` (verified states)
- **Soft Blue:** `#3B82F6` (informational/pending)
- **Amber:** `#F59E0B` (attention-needed)
- **Coral:** `#EF4444` (errors only)

### Typography
- 8pt grid system
- Summary-first with expandable sections
- Progressive disclosure for context

### Fairness-Forward Language
- "Needs Context" NOT "Suspicious"
- "Highlighted for Review" NOT "Flagged"
- "Adjustment" NOT "Penalty"
- Behavioral context labeled "CONTEXT - NOT JUDGMENT"

---

## Key Features

### Fairness-First Architecture
- No automated negative trust impacts
- Human-in-loop for all decisions
- 3+ pattern requirement before trust reduction
- Mandatory justifications for negative actions
- 48-hour appeal window

### Transparent Session Monitoring
- Visible context bar: "Session context is being gathered..."
- Expandable tooltips explaining what's logged
- Neutral observations, never accusations
- Students can explain workflow before judgment

### Oral Defense Upgrades
- Students can demonstrate understanding
- Upgrade from "Verified with Assistance" to "Independent Work"
- Resolve ambiguities through live sessions
- Supportive, non-threatening environment

### Public Credentials
- Permanent, shareable skill receipts
- Only positive authenticity badges shown publicly
- Cryptographic verification (hash, timestamp)
- Social sharing optimized
- PDF download, embed code

### Trust Score System
- 0-100 scale with clear levels
- Contributing factors explained
- Improvement pathways with projected impact
- History timeline with transparent changes

---

## File Structure

```
/app
  /student
    /dashboard/page.tsx          - Student home
    /tasks/page.tsx              - Task marketplace
    /task/[id]/page.tsx          - Task execution
    /trust/page.tsx              - Trust center
  /company
    /review/page.tsx             - Review dashboard
    /create-task/page.tsx        - Task creation wizard
  /recruiter
    /compare/page.tsx            - Candidate comparison
  /defense/[sessionId]/page.tsx  - Oral defense
  /receipt/[id]/page.tsx         - Public receipt
  /portfolio/[studentId]/page.tsx - Public portfolio
  /api
    /agent/route.ts              - Agent API handler
  page.tsx                       - Main application (all screens)
  layout.tsx                     - Root layout

/components
  (Reusable components integrated in main page.tsx)

/lib
  aiAgent.ts                     - AI agent integration utility

/types
  index.ts                       - TypeScript interfaces

/response_schemas
  /test_results                  - Actual agent test responses
    task_variant_generator_test_result.json
    session_monitor_test_result.json
    evaluation_manager_test_result.json
    fairness_guardian_test_result.json
    review_assistant_test_result.json
    trust_score_calculator_test_result.json
    receipt_generator_test_result.json
    defense_coordinator_test_result.json

workflow.json                    - Complete workflow definition
workflow_state.json              - Agent IDs and status
PROOFLY_AGENT_SYSTEM.md         - Agent documentation
```

---

## Agent Integration

### Using aiAgent.ts

All agent calls use the existing `/lib/aiAgent.ts` utility:

```typescript
import { callAIAgent } from '@/lib/aiAgent'

// Generate task variant
const result = await callAIAgent(
  'Generate a unique variant for Data Pipeline Challenge for student 12345',
  '698592afe5d25ce3f598cb71' // Task Variant Generator
)

if (result.success) {
  const variant = result.response.result
  console.log(variant.variant_id)
  console.log(variant.parameters)
}
```

### React Hook

```typescript
import { useAIAgent } from '@/lib/aiAgent'

function MyComponent() {
  const { callAgent, loading, error, response } = useAIAgent()

  const handleGenerate = async () => {
    const result = await callAgent(
      'Generate variant...',
      '698592afe5d25ce3f598cb71'
    )
  }

  return <button onClick={handleGenerate}>Generate</button>
}
```

---

## Complete User Journey

1. **Student signs up** → Profile created with Trust Score 70 ("Good")
2. **Browses tasks** → Filters by Python skills
3. **Selects task** → "Data Pipeline Challenge"
4. **Sees unique variant badge** → Variant 7842 assigned
5. **Starts task** → Monitoring context bar appears (transparent)
6. **Works 45 minutes** → Session Monitor logs behavior
7. **Submits solution** → Anomaly detected (large paste)
8. **Explain Process Modal** → "I coded in VS Code locally, then pasted"
9. **Evaluation Manager** → Quality: 86/100, Context: "Extended local development"
10. **Reviewer sees** → Full context + student explanation + fairness reminder
11. **Approves** → "Verified Independent Work"
12. **Receipt generates** → Green verification badge
13. **Student shares** → Posts to LinkedIn
14. **Recruiter discovers** → Clicks through to verified receipt
15. **Views portfolio** → Sees 5 receipts, 100% verified rate
16. **Adds to shortlist** → Begins interview process

---

## Production States

### Loading
- Skeleton loaders matching component shapes
- Pulse animation
- Reassuring messages

### Empty States
- Helpful illustrations
- Actionable suggestions
- Example: "No receipts yet - Browse tasks to start building your portfolio"

### Error States
- Clear error messages
- Recovery actions
- Retry buttons
- Support contact

### Success States
- Confirmation messages
- Next-step suggestions
- Milestone celebrations (subtle animations)

---

## Security & Privacy

### Session Monitoring
- Transparent to students
- Context explained upfront
- Presented as observations, not evidence
- Students provide explanations before judgment

### Human Review Required
- No automated negative impacts
- All decisions require human justification
- Pattern requirement (3+ issues) enforced
- Appeal process guaranteed

### Public Data
- Only positive authenticity states public
- No negative badges on receipts
- Student controls portfolio visibility
- Verification without judgment

---

## Technical Implementation

### TypeScript Interfaces
All agent responses mapped to clean TypeScript interfaces in `/types/index.ts`:
- TaskVariant
- SessionContext
- EvaluationResult
- FairnessValidation
- ReviewContext
- TrustScore
- SkillReceipt
- DefenseSession

### Agent Response Parsing
Clean JSON parsing with error handling:
```typescript
try {
  const result = await callAIAgent(message, agentId)
  if (result.success && result.response.status === 'success') {
    const data = result.response.result as TaskVariant
    // Use strongly-typed data
  }
} catch (error) {
  // Handle gracefully with inline notification
}
```

### No External Notification Libraries
- Inline success/error/info messages
- No toast or sonner
- Contextual feedback within UI

### No Authentication Flow
- OAuth already integrated
- No sign-in screens created
- Ready for existing auth system

---

## Development

### Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

### Role Switcher
Top-right role selector:
- Student view
- Company view
- Recruiter view

Each role shows contextual navigation and features.

### Testing Agent Integration

Replace mock data with live agent calls:

```typescript
// Current (mock data)
const mockVariant = { variant_id: '7842', ... }

// Replace with
const result = await callAIAgent(
  `Generate variant for task ${taskId} and student ${studentId}`,
  '698592afe5d25ce3f598cb71'
)
const variant = result.response.result
```

---

## Future Enhancements

### Phase 2
- Real-time video integration for oral defense
- Live code editor with syntax highlighting
- Mobile app for task execution
- Browser extension for code monitoring

### Phase 3
- Blockchain verification for receipts
- Integration with job platforms (LinkedIn, Indeed)
- Company analytics dashboard
- Student skill progression AI recommendations

### Phase 4
- International expansion (multi-language)
- Industry-specific skill taxonomies
- Certification partnerships
- Enterprise LMS integration

---

## Support

For questions about:
- **Agent system:** See `PROOFLY_AGENT_SYSTEM.md`
- **Workflow:** See `workflow.json`
- **API integration:** See `/lib/aiAgent.ts`
- **Type definitions:** See `/types/index.ts`

---

## License & Credits

Built with:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lyzr AI Agent Platform

Design philosophy: **Fairness First, Improvement Focus, Human-in-Loop**

---

## Quick Reference

### Agent IDs
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

### Key Routes
- Student: `/student/dashboard`, `/student/tasks`, `/student/trust`
- Company: `/company/review`, `/company/create-task`
- Recruiter: `/recruiter/compare`
- Public: `/receipt/[id]`, `/portfolio/[studentId]`
- Defense: `/defense/[sessionId]`

### Color Palette
```css
--primary: #0F172A;
--secondary: #334155;
--trust-green: #10B981;
--info-blue: #3B82F6;
--attention-amber: #F59E0B;
--error-coral: #EF4444;
```

---

**Status:** Complete and ready for integration testing
**Version:** 1.0.0
**Last Updated:** 2026-02-06
