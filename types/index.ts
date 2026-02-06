// Proofly Trust-Based Skill Verification Platform - Type Definitions

// Agent Response Types (based on workflow.json agent descriptions)

export interface TaskVariant {
  task_id: string
  title: string
  description: string
  company: {
    name: string
    logo_url: string
  }
  skills: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_time: number // minutes
  time_limit: number // minutes
  variant_seed: string
  unique_parameters: Record<string, any>
  instructions: string
  evaluation_criteria: string[]
}

export interface SessionContext {
  session_id: string
  start_time: string
  end_time?: string
  active_time: number // seconds
  thinking_time: number // seconds
  observations: {
    timestamp: string
    type: 'paste' | 'switch' | 'search' | 'focus' | 'edit'
    description: string
    context?: string
  }[]
  workflow_summary: string
}

export interface EvaluationResult {
  submission_id: string
  code_quality: {
    score: number
    strengths: string[]
    areas_for_improvement: string[]
  }
  behavioral_context: {
    patterns_detected: string[]
    needs_explanation: boolean
    highlighted_observations: {
      description: string
      context_needed: string
    }[]
  }
  recommendation: 'approve_independent' | 'approve_with_assistance' | 'request_clarification' | 'offer_defense'
}

export interface FairnessValidation {
  validation_id: string
  decision_type: 'positive' | 'negative' | 'neutral'
  fairness_checks: {
    check: string
    passed: boolean
    details?: string
  }[]
  pattern_count: number
  minimum_pattern_threshold: number
  can_proceed: boolean
  warnings: string[]
  student_rights_honored: boolean
}

export interface ReviewContext {
  submission_id: string
  student: {
    id: string
    name: string
    avatar_url?: string
    trust_score: number
  }
  task: TaskVariant
  code_submission: string
  session_context: SessionContext
  evaluation: EvaluationResult
  student_explanation?: string
  fairness_reminders: string[]
  decision_options: {
    type: string
    label: string
    impact?: string
    requires_justification: boolean
  }[]
}

export interface TrustScore {
  score: number // 0-100
  level: 'building' | 'developing' | 'established' | 'verified'
  trend: 'improving' | 'stable' | 'needs_attention'
  breakdown: {
    factor: string
    weight: number
    contribution: number
  }[]
  improvement_paths: {
    action: string
    projected_impact: number
    description: string
  }[]
  history: {
    date: string
    score: number
    event: string
  }[]
}

export interface SkillReceipt {
  receipt_id: string
  receipt_hash: string
  timestamp: string
  student: {
    id: string
    name: string
    avatar_url?: string
  }
  task: {
    title: string
    company: string
    company_logo_url: string
  }
  skills: string[]
  verification_status: 'verified_independent' | 'verified_with_assistance'
  defense_upgrade?: {
    upgraded: boolean
    date: string
    outcome: string
  }
  scores: {
    code_quality: number
    problem_solving: number
    technical_skill: number
    overall: number
  }
  ai_feedback: string
  public_url: string
  qr_code_url: string
  shareable: boolean
}

export interface DefenseSession {
  session_id: string
  student: {
    id: string
    name: string
    avatar_url?: string
  }
  reviewer: {
    id: string
    name: string
  }
  task: {
    title: string
  }
  status: 'scheduled' | 'in_progress' | 'completed'
  start_time?: string
  duration?: number // minutes
  questions: {
    question: string
    student_answer?: string
    reviewer_notes?: string
  }[]
  live_collaboration?: {
    code_snippet: string
    line_numbers: number[]
  }
  outcome?: {
    upgraded: boolean
    verification_level: string
    feedback: string
  }
}

export interface StudentPortfolio {
  student_id: string
  name: string
  avatar_url?: string
  bio?: string
  trust_score: number
  verification_badge: string
  total_receipts: number
  receipts: SkillReceipt[]
  skills: {
    skill: string
    level: number // 0-100
    receipts_count: number
    progression: {
      date: string
      level: number
    }[]
  }[]
  timeline: {
    date: string
    event: string
    receipt_id?: string
  }[]
  public: boolean
}

export interface TaskCreation {
  title: string
  description: string
  skills: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_time: number
  time_limit: number
  constraints: string[]
  dynamic_parameters: {
    parameter: string
    type: 'random_number' | 'random_string' | 'random_dataset' | 'random_constraint'
    options: any[]
  }[]
  evaluation_criteria: {
    criterion: string
    weight: number
    description: string
  }[]
  review_guidelines: {
    guideline: string
    fairness_check: boolean
  }[]
}

export interface CandidateComparison {
  candidates: {
    student_id: string
    name: string
    avatar_url?: string
    trust_score: number
    total_receipts: number
    skills: string[]
    top_scores: number[]
    portfolio_url: string
  }[]
  filters: {
    skills?: string[]
    min_trust_score?: number
    verification_level?: string[]
  }
}
