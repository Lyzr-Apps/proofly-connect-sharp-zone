# Proofly Trust-Based Skill Verification Platform
## Complete Agent System Documentation

### System Overview
Proofly is a fairness-first skill verification platform that enables students to build verified skill portfolios through unique task variants, transparent behavioral monitoring, and human-centered evaluation.

---

## Agent Architecture

### 1. Task Variant Generator
**Agent ID:** `698592afe5d25ce3f598cb71`
**Purpose:** Generate unique, fair task variants for each student

**Key Features:**
- Creates personalized task parameters
- Randomizes datasets and constraints
- Ensures difficulty equivalence across variants
- Maintains uniqueness tracking

**Response Schema:** `/response_schemas/task_variant_generator_response.json`

---

### 2. Session Monitor
**Agent ID:** `698592c7e17e33c11eed1a75`
**Purpose:** Collect neutral behavioral context during task sessions

**Key Features:**
- Transparent data collection (students see everything)
- Keystroke patterns and timing analysis
- Neutral observation language (never accusatory)
- No automated judgments

**Critical Language:**
- "Needs Context" NOT "Suspicious"
- "Highlighted for Review" NOT "Flagged"

**Response Schema:** `/response_schemas/session_monitor_response.json`

---

### 3. Evaluation Manager
**Agent ID:** `698592e0fe576c19864be864`
**Purpose:** Coordinate comprehensive submission evaluation

**Key Features:**
- Technical quality analysis (objective)
- Behavioral context compilation (neutral)
- Similarity report generation
- Intelligent routing (to Fairness Guardian if 3+ patterns)

**Response Schema:** `/response_schemas/evaluation_manager_response.json`

---

### 4. Fairness Guardian
**Agent ID:** `698592fcf7f7d3ffa5d86538`
**Purpose:** Enforce ethical AI usage and protect student rights

**Key Features:**
- BLOCKS decisions with <3 patterns
- Requires human justification
- Validates neutral language
- Enforces appeal rights
- Prevents automated negative decisions

**Critical Rules:**
- 3+ pattern requirement for trust impact
- No automated trust score reductions
- Human review required for all flags

**Response Schema:** `/response_schemas/fairness_guardian_response.json`

---

### 5. Review Assistant
**Agent ID:** `698593191caa4e686dd66f21`
**Purpose:** Facilitate fair human review decisions

**Key Features:**
- Presents full context with fairness reminders
- Surfaces student explanations prominently
- Shows AI confidence levels
- Requires reviewer justification
- Suggests oral defense when ambiguous

**Fairness Reminders:**
- "Behavioral patterns may have legitimate explanations"
- "Consider the student's explanation carefully"
- "When in doubt, request an oral defense for clarity"

**Response Schema:** `/response_schemas/review_assistant_response.json`

---

### 6. Trust Score Calculator
**Agent ID:** `69859337a791e6e318b8df57`
**Purpose:** Calculate improvement-focused trust scores

**Key Features:**
- Transparent score computation (0-100)
- Improvement pathways, not penalties
- Oral defenses can upgrade scores
- Historical trend tracking
- No single-incident penalties

**Score Factors:**
- Verified Independent Work: +high
- Verified with Assistance: +moderate
- Successful Oral Defenses: +upgrade
- Consistency: +reliability bonus
- Improvement trend: +growth bonus

**Response Schema:** `/response_schemas/trust_score_calculator_response.json`

---

### 7. Receipt Generator
**Agent ID:** `69859356fe576c19864be875`
**Purpose:** Generate verified skill credentials

**Key Features:**
- Multiple formats (PDF, digital badge, JSON)
- Cryptographic verification (hash, signature)
- Only positive authenticity states publicly
- Shareable portfolio integration

**Authenticity Badges:**
- "Verified Independent Work"
- "Verified with Assistance"
- "Skill Demonstrated"
- "Oral Defense Verified"

**Prohibited on Public Receipts:**
- "Under Review" status
- Behavioral observations
- Negative verification states

**Response Schema:** `/response_schemas/receipt_generator_response.json`

---

### 8. Defense Coordinator
**Agent ID:** `69859377fe576c19864be878`
**Purpose:** Coordinate supportive oral defense sessions

**Key Features:**
- Opportunity-focused (not interrogation)
- Can only UPGRADE verification levels
- Clear rubrics and expectations
- Pre-defense anxiety reduction
- Student-requested or reviewer-recommended

**Upgrade Paths:**
- "Needs Context" → "Verified with Assistance"
- "Needs Context" → "Verified Independent Work"
- Any → "Oral Defense Verified" (special badge)

**Prohibited:**
- Hostile questioning
- Downgrading verification
- Surprise technical questions

**Response Schema:** `/response_schemas/defense_coordinator_response.json`

---

## Workflow Flow

### Primary Path
1. **Task Variant Generator** - Student receives unique task
2. **Session Monitor** - Transparent behavioral tracking
3. **Evaluation Manager** - Technical + behavioral analysis
4. **Fairness Guardian** - Ethics validation
5. **Review Assistant** - Human review with context
6. **Trust Score Calculator** - Update trust metrics
7. **Receipt Generator** - Create credential

### Alternative Path (Oral Defense)
1. **Evaluation Manager** - Detects ambiguity
2. **Defense Coordinator** - Schedule defense session
3. **Receipt Generator** - Generate upgraded credential

---

## Fairness Framework

### Core Principles
1. **Neutral Language** - Never accusatory
2. **Human-in-Loop** - All negative decisions require human review
3. **3+ Pattern Requirement** - Before any trust impact
4. **Improvement Focus** - Show paths to improve
5. **Oral Defense Upgrades** - Always opportunity to demonstrate understanding
6. **Public Positivity** - Only positive states on public receipts

### Prohibited Actions
- Automated trust score reductions
- Single-pattern penalties
- Accusatory language
- Hidden decision factors
- Permanent exclusions without appeal

### Student Rights
- Transparent data collection
- Opportunity to explain process
- Proactive oral defense requests
- Appeal all decisions
- See all behavioral context
- Control public portfolio visibility

---

## Design System

### Colors
- **Primary:** Deep Navy (#0F172A)
- **Secondary:** Slate Gray (#334155)
- **Verified:** Trust Green (#10B981)
- **Info:** Soft Blue (#3B82F6)
- **Attention:** Amber (#F59E0B)
- **Error:** Coral (#EF4444)

### Language Guidelines

**USE:**
- Needs Context
- Highlighted for Review
- Pattern Requires Context
- Verification Pending

**AVOID:**
- Suspicious
- Flagged
- Cheating
- Fraudulent

---

## File Structure

```
/app/nextjs-project/
├── workflow.json                           # Complete workflow definition
├── workflow_state.json                     # Agent IDs and status
├── response_schemas/
│   ├── task_variant_generator_response.json
│   ├── session_monitor_response.json
│   ├── evaluation_manager_response.json
│   ├── fairness_guardian_response.json
│   ├── review_assistant_response.json
│   ├── trust_score_calculator_response.json
│   ├── receipt_generator_response.json
│   └── defense_coordinator_response.json
└── PROOFLY_AGENT_SYSTEM.md                # This file
```

---

## User Journey

1. **Browse Tasks** → Student explores available skill challenges
2. **Start Unique Variant** → Task Variant Generator creates personalized version
3. **Session Monitoring** → Transparent behavioral tracking (student aware)
4. **Submit Work** → Evaluation Manager analyzes
5. **[If Anomaly]** → Explain Process Modal shown to student
6. **Fairness Validation** → Fairness Guardian checks ethics
7. **Human Review** → Review Assistant presents context
8. **Decision** → Human makes justified decision
9. **Receipt Generated** → Professional credential created
10. **Public Portfolio** → Shareable skill verification

### Optional: Oral Defense Path
- Student requests OR reviewer recommends
- Defense Coordinator schedules supportive session
- Verification level upgraded based on demonstration
- Enhanced receipt with "Oral Defense Verified" badge

---

## Key Differentiators

### Trust, Not Surveillance
- Behavioral monitoring provides context, not judgment
- Students see all collected data
- Human interpretation required

### Fairness First
- Fairness Guardian actively blocks unfair decisions
- 3+ pattern requirement prevents single-incident bias
- Neutral language throughout

### Improvement Focused
- Trust scores show improvement paths
- Oral defenses upgrade verification
- No permanent damage to reputation

### Public Credibility
- Only positive authenticity states shown publicly
- Cryptographically verified credentials
- Multi-format sharing (PDF, badge, JSON)

---

## Implementation Notes

### All Agents Use:
- **Model:** gpt-4o
- **Provider:** OpenAI
- **Temperature:** 0.3
- **Top_p:** 1

### Response Format (All Agents):
```json
{
  "status": "success" | "error",
  "result": { /* agent-specific fields */ },
  "metadata": {
    "agent_name": "...",
    "timestamp": "ISO 8601"
  }
}
```

### Integration Points
- Session Monitor → Evaluation Manager (behavioral data)
- Evaluation Manager → Fairness Guardian (ethics check)
- Fairness Guardian → Review Assistant (approved for review)
- Review Assistant → Trust Score Calculator (decision impact)
- Trust Score Calculator → Receipt Generator (score context)
- Defense Coordinator → Receipt Generator (verification upgrade)

---

## Success Metrics

### Fairness Indicators
- % of decisions with human justification
- Pattern count distribution (ensure 3+ requirement)
- Oral defense success rate
- Student appeal outcomes

### Platform Health
- Trust score improvement trends
- Receipt generation rate
- Verification level distribution
- Student satisfaction with fairness

### Technical Quality
- Task variant uniqueness
- Similarity detection accuracy
- Behavioral context relevance
- Cryptographic verification success

---

**Created:** 2026-02-06
**Version:** 1.0.0
**Total Agents:** 8
**Status:** All agents active and operational
