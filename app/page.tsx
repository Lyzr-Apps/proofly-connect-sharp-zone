'use client'

/**
 * Proofly Trust-Based Skill Verification Platform
 * Complete UI with all 12 screens
 */

import { useState, useEffect } from 'react'
import {
  FiHome, FiUsers, FiCheckCircle, FiClock, FiTrendingUp,
  FiSearch, FiFilter, FiBookmark, FiVideo, FiShare2,
  FiFileText, FiAward, FiShield, FiSettings, FiMenu,
  FiX, FiChevronRight, FiAlertCircle, FiDownload,
  FiCopy, FiExternalLink, FiPlusCircle, FiRefreshCw,
  FiChevronDown, FiChevronUp, FiPlay, FiPause, FiEye,
  FiEdit, FiTrash2, FiStar, FiTarget, FiBarChart2,
  FiCalendar, FiGitBranch, FiCode, FiMessageSquare
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { callAIAgent, uploadFiles } from '@/lib/aiAgent'
import type {
  TaskVariant, SessionContext, EvaluationResult, FairnessValidation,
  ReviewContext, TrustScore, SkillReceipt, DefenseSession,
  StudentPortfolio, TaskCreation, CandidateComparison
} from '@/types'

// Agent IDs from workflow.json
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

// Design System Colors
const COLORS = {
  primary: '#0F172A',
  secondary: '#334155',
  verified: '#10B981',
  info: '#3B82F6',
  attention: '#F59E0B',
  error: '#EF4444',
}

// Screen Types
type Screen =
  | 'student-dashboard'
  | 'task-marketplace'
  | 'task-execution'
  | 'company-review'
  | 'defense-session'
  | 'skill-receipt'
  | 'public-portfolio'
  | 'trust-center'
  | 'company-create-task'
  | 'recruiter-compare'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('student-dashboard')
  const [userRole, setUserRole] = useState<'student' | 'company' | 'recruiter'>('student')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // State for various screens
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [showExplanationModal, setShowExplanationModal] = useState(false)
  const [showNegativeActionModal, setShowNegativeActionModal] = useState(false)

  // Loading & notification states
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)

  // Mock data - in production, this would come from agent responses
  const mockTrustScore: TrustScore = {
    score: 78,
    level: 'established',
    trend: 'improving',
    breakdown: [
      { factor: 'Code Quality', weight: 0.3, contribution: 25 },
      { factor: 'Consistent Verification', weight: 0.25, contribution: 20 },
      { factor: 'Explanation Clarity', weight: 0.2, contribution: 16 },
      { factor: 'Defense Performance', weight: 0.15, contribution: 12 },
      { factor: 'Peer Reviews', weight: 0.1, contribution: 5 },
    ],
    improvement_paths: [
      { action: 'Complete 2 more independent tasks', projected_impact: 5, description: 'Boost verification consistency' },
      { action: 'Participate in code review', projected_impact: 3, description: 'Demonstrate knowledge sharing' },
      { action: 'Complete advanced difficulty task', projected_impact: 4, description: 'Show skill progression' },
    ],
    history: [
      { date: '2026-02-01', score: 75, event: 'Completed React task' },
      { date: '2026-01-28', score: 73, event: 'Defense session upgrade' },
      { date: '2026-01-25', score: 70, event: 'Completed TypeScript task' },
    ],
  }

  const mockReceipts: SkillReceipt[] = [
    {
      receipt_id: 'RCP-2026-001',
      receipt_hash: 'a3f7b2c9d4e8f1a6b5c7d9e2f3a4b6c8',
      timestamp: '2026-02-05T10:30:00Z',
      student: {
        id: 'STU-001',
        name: 'Alex Chen',
        avatar_url: '/avatars/alex.jpg',
      },
      task: {
        title: 'Build React Component Library',
        company: 'TechCorp',
        company_logo_url: '/logos/techcorp.png',
      },
      skills: ['React', 'TypeScript', 'Component Design'],
      verification_status: 'verified_independent',
      scores: {
        code_quality: 92,
        problem_solving: 88,
        technical_skill: 90,
        overall: 90,
      },
      ai_feedback: 'Excellent component architecture with strong TypeScript typing. Clean separation of concerns.',
      public_url: 'https://proofly.io/receipt/RCP-2026-001',
      qr_code_url: '/qr/RCP-2026-001.png',
      shareable: true,
    },
    {
      receipt_id: 'RCP-2026-002',
      receipt_hash: 'b4f8c3d0e5f9g2a7b6c8d0e3f4a5b7c9',
      timestamp: '2026-02-03T14:15:00Z',
      student: {
        id: 'STU-001',
        name: 'Alex Chen',
      },
      task: {
        title: 'API Integration Challenge',
        company: 'DataFlow',
        company_logo_url: '/logos/dataflow.png',
      },
      skills: ['REST API', 'Authentication', 'Error Handling'],
      verification_status: 'verified_with_assistance',
      defense_upgrade: {
        upgraded: true,
        date: '2026-02-03',
        outcome: 'Successfully demonstrated understanding of OAuth flow',
      },
      scores: {
        code_quality: 85,
        problem_solving: 82,
        technical_skill: 84,
        overall: 84,
      },
      ai_feedback: 'Solid implementation with good error handling. Authentication flow correctly implemented.',
      public_url: 'https://proofly.io/receipt/RCP-2026-002',
      qr_code_url: '/qr/RCP-2026-002.png',
      shareable: true,
    },
  ]

  const mockTasks: TaskVariant[] = [
    {
      task_id: 'TSK-001',
      title: 'Build Interactive Data Dashboard',
      description: 'Create a responsive dashboard with real-time data visualization',
      company: {
        name: 'AnalyticsPro',
        logo_url: '/logos/analyticspro.png',
      },
      skills: ['React', 'D3.js', 'Data Visualization'],
      difficulty: 'intermediate',
      estimated_time: 120,
      time_limit: 180,
      variant_seed: 'var-123',
      unique_parameters: { dataset_theme: 'sales', chart_types: ['bar', 'line'] },
      instructions: 'Build a dashboard displaying sales data with interactive charts...',
      evaluation_criteria: ['Code organization', 'Chart interactivity', 'Responsive design'],
    },
    {
      task_id: 'TSK-002',
      title: 'Authentication System Implementation',
      description: 'Implement secure user authentication with JWT',
      company: {
        name: 'SecureAuth',
        logo_url: '/logos/secureauth.png',
      },
      skills: ['Node.js', 'JWT', 'Security'],
      difficulty: 'advanced',
      estimated_time: 150,
      time_limit: 210,
      variant_seed: 'var-124',
      unique_parameters: { auth_provider: 'custom', session_duration: 3600 },
      instructions: 'Implement JWT-based authentication with refresh tokens...',
      evaluation_criteria: ['Security practices', 'Token management', 'Error handling'],
    },
  ]

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Navigation
  const NavigationSidebar = () => (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden z-50`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Proofly</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="mb-6">
          <Label className="text-sm text-slate-400 mb-2 block">View as:</Label>
          <Select value={userRole} onValueChange={(val) => setUserRole(val as any)}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="recruiter">Recruiter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-slate-700 my-4" />

        {/* Navigation Links */}
        <nav className="space-y-2">
          {userRole === 'student' && (
            <>
              <NavLink icon={FiHome} label="Dashboard" active={currentScreen === 'student-dashboard'} onClick={() => setCurrentScreen('student-dashboard')} />
              <NavLink icon={FiSearch} label="Task Marketplace" active={currentScreen === 'task-marketplace'} onClick={() => setCurrentScreen('task-marketplace')} />
              <NavLink icon={FiShield} label="Trust Center" active={currentScreen === 'trust-center'} onClick={() => setCurrentScreen('trust-center')} />
              <NavLink icon={FiAward} label="My Receipts" active={currentScreen === 'skill-receipt'} onClick={() => setCurrentScreen('skill-receipt')} />
              <NavLink icon={FiUsers} label="Public Portfolio" active={currentScreen === 'public-portfolio'} onClick={() => setCurrentScreen('public-portfolio')} />
            </>
          )}
          {userRole === 'company' && (
            <>
              <NavLink icon={FiCheckCircle} label="Review Dashboard" active={currentScreen === 'company-review'} onClick={() => setCurrentScreen('company-review')} />
              <NavLink icon={FiPlusCircle} label="Create Task" active={currentScreen === 'company-create-task'} onClick={() => setCurrentScreen('company-create-task')} />
              <NavLink icon={FiVideo} label="Defense Sessions" active={currentScreen === 'defense-session'} onClick={() => setCurrentScreen('defense-session')} />
            </>
          )}
          {userRole === 'recruiter' && (
            <>
              <NavLink icon={FiBarChart2} label="Compare Candidates" active={currentScreen === 'recruiter-compare'} onClick={() => setCurrentScreen('recruiter-compare')} />
              <NavLink icon={FiSearch} label="Search Portfolios" active={currentScreen === 'public-portfolio'} onClick={() => setCurrentScreen('public-portfolio')} />
            </>
          )}
        </nav>

        {/* Trust Score Widget (Student only) */}
        {userRole === 'student' && (
          <div className="mt-8">
            <TrustScoreWidget score={mockTrustScore} compact />
          </div>
        )}
      </div>
    </div>
  )

  const NavLink = ({ icon: Icon, label, active, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )

  // Component: Trust Score Widget
  const TrustScoreWidget = ({ score, compact = false }: { score: TrustScore, compact?: boolean }) => (
    <Card className={compact ? 'bg-slate-800 border-slate-700' : ''}>
      <CardHeader>
        <CardTitle className={compact ? 'text-white text-sm' : ''}>Trust Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#334155" strokeWidth="8" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={COLORS.verified}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${score.score * 3.51} 351`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${compact ? 'text-white' : ''}`}>{score.score}</span>
              <span className={`text-xs ${compact ? 'text-slate-400' : 'text-slate-500'}`}>/ 100</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={score.trend === 'improving' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
              <FiTrendingUp size={12} className="mr-1" />
              {score.level}
            </Badge>
          </div>
          {!compact && (
            <Button variant="outline" className="mt-4 w-full" onClick={() => setCurrentScreen('trust-center')}>
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Screen 1: Student Dashboard
  const StudentDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Portfolio Highlights */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome back, Alex!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Receipts</p>
                    <p className="text-3xl font-bold">{mockReceipts.length}</p>
                  </div>
                  <FiAward size={32} className="text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Skills Verified</p>
                    <p className="text-3xl font-bold">8</p>
                  </div>
                  <FiCheckCircle size={32} className="text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Avg Score</p>
                    <p className="text-3xl font-bold">87</p>
                  </div>
                  <FiStar size={32} className="text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Receipts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Receipts</h3>
            <Button variant="ghost" size="sm" onClick={() => setCurrentScreen('skill-receipt')}>
              View All <FiChevronRight className="ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {mockReceipts.slice(0, 3).map((receipt) => (
              <ReceiptCard key={receipt.receipt_id} receipt={receipt} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Actions & Trust Score */}
      <div className="space-y-6">
        <TrustScoreWidget score={mockTrustScore} />

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => setCurrentScreen('task-marketplace')}>
              <FiSearch className="mr-2" />
              Browse Tasks
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setCurrentScreen('public-portfolio')}>
              <FiShare2 className="mr-2" />
              Share Portfolio
            </Button>
            <Button variant="outline" className="w-full">
              <FiSettings className="mr-2" />
              Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="flex items-start gap-2">
                <FiCheckCircle className="text-green-500 mt-1" size={16} />
                <div>
                  <p className="font-medium">Receipt Generated</p>
                  <p className="text-slate-500 text-xs">Your React Component task is ready</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="text-sm">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-blue-500 mt-1" size={16} />
                <div>
                  <p className="font-medium">New Tasks Available</p>
                  <p className="text-slate-500 text-xs">3 new tasks match your skills</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Screen 2: Task Marketplace
  const TaskMarketplace = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [skillFilter, setSkillFilter] = useState<string[]>([])
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all')

    return (
      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FiFilter size={16} />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Difficulty</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Skills</Label>
                <div className="space-y-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'Data Viz'].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <Checkbox
                        id={skill}
                        checked={skillFilter.includes(skill)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSkillFilter([...skillFilter, skill])
                          } else {
                            setSkillFilter(skillFilter.filter(s => s !== skill))
                          }
                        }}
                      />
                      <label htmlFor={skill} className="text-sm cursor-pointer">{skill}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Time Limit</Label>
                <Slider defaultValue={[180]} max={360} step={30} className="mt-2" />
                <p className="text-xs text-slate-500 mt-1">Up to 3 hours</p>
              </div>

              <Button variant="outline" className="w-full" onClick={() => {
                setSkillFilter([])
                setDifficultyFilter('all')
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Task Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search tasks by title, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTasks.map((task) => (
              <Card key={task.task_id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                setSelectedTask(task.task_id)
                setCurrentScreen('task-execution')
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                        <FiCode size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <p className="text-sm text-slate-500">{task.company.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Unique Variant
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{task.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-slate-500">
                        <FiClock size={14} />
                        {task.estimated_time}min
                      </span>
                      <Badge className={
                        task.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        task.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm">
                      Start Task <FiChevronRight className="ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockTasks.length === 0 && (
            <div className="text-center py-12">
              <FiSearch size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks match your filters</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Screen 3: Task Execution Environment
  const TaskExecution = () => {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [activeTab, setActiveTab] = useState('browser-ide')
    const [code, setCode] = useState('// Start coding here...')
    const task = mockTasks[0]

    useEffect(() => {
      let interval: NodeJS.Timeout
      if (isTimerActive) {
        interval = setInterval(() => {
          setElapsedTime(prev => prev + 1)
        }, 1000)
      }
      return () => clearInterval(interval)
    }, [isTimerActive])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <div className="h-screen flex flex-col">
        {/* Sticky Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{task.title}</h2>
              <p className="text-sm text-slate-500">{task.company.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-slate-500">Elapsed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-blue-600">{formatTime(task.time_limit * 60 - elapsedTime)}</p>
                <p className="text-xs text-slate-500">Remaining</p>
              </div>
              <Button
                variant={isTimerActive ? 'destructive' : 'default'}
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? <><FiPause className="mr-2" /> Pause</> : <><FiPlay className="mr-2" /> Start</>}
              </Button>
            </div>
          </div>

          {/* Monitoring Context Bar */}
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <FiEye className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Session context is being gathered to help reviewers understand your workflow. All observations are shared with you.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Instructions Panel */}
          <div className="w-2/5 border-r overflow-y-auto p-6 bg-slate-50">
            <h3 className="font-semibold mb-4">Instructions</h3>
            <div className="prose prose-sm">
              <p>{task.instructions}</p>
            </div>

            <Separator className="my-6" />

            <h3 className="font-semibold mb-4">Evaluation Criteria</h3>
            <ul className="space-y-2">
              {task.evaluation_criteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FiCheckCircle className="text-green-500 mt-1" size={16} />
                  <span className="text-sm">{criterion}</span>
                </li>
              ))}
            </ul>

            <Separator className="my-6" />

            <h3 className="font-semibold mb-4">Workflow Tips</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="text-sm space-y-2 text-blue-900">
                <li>Take your time to understand the requirements</li>
                <li>Test your code thoroughly before submitting</li>
                <li>Add comments to explain your approach</li>
                <li>Ask for clarification if needed</li>
              </ul>
            </div>
          </div>

          {/* Workspace Panel */}
          <div className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="border-b rounded-none w-full justify-start px-6">
                <TabsTrigger value="browser-ide">Browser IDE</TabsTrigger>
                <TabsTrigger value="file-upload">File Upload</TabsTrigger>
                <TabsTrigger value="github-link">GitHub Link</TabsTrigger>
              </TabsList>

              <TabsContent value="browser-ide" className="flex-1 p-6">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono h-full resize-none"
                  placeholder="// Start coding here..."
                />
              </TabsContent>

              <TabsContent value="file-upload" className="flex-1 p-6">
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <FiFileText size={48} className="mx-auto text-slate-300 mb-4" />
                  <h4 className="font-semibold mb-2">Upload your solution files</h4>
                  <p className="text-sm text-slate-500 mb-4">Drag and drop or click to browse</p>
                  <Input type="file" className="max-w-xs mx-auto" />
                </div>
              </TabsContent>

              <TabsContent value="github-link" className="flex-1 p-6">
                <div className="max-w-xl">
                  <Label className="mb-2 block">GitHub Repository URL</Label>
                  <Input placeholder="https://github.com/username/repo" className="mb-4" />
                  <Button>
                    <FiGitBranch className="mr-2" />
                    Connect Repository
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Execution Log */}
            <div className="border-t p-4 bg-slate-50">
              <h4 className="text-sm font-semibold mb-2">Execution Log</h4>
              <div className="bg-black text-green-400 font-mono text-xs p-3 rounded max-h-32 overflow-y-auto">
                <div>System: Ready to execute code</div>
                <div>User: Started coding at {formatTime(elapsedTime)}</div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t p-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setCurrentScreen('task-marketplace')}>
                Save Draft
              </Button>
              <Button onClick={() => {
                setIsTimerActive(false)
                showNotification('success', 'Submission received! Evaluation in progress...')
                setTimeout(() => setCurrentScreen('student-dashboard'), 2000)
              }}>
                Submit Solution
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Screen 4: Explain Your Process Modal
  const ExplanationModal = () => (
    <Dialog open={showExplanationModal} onOpenChange={setShowExplanationModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Help Us Understand Your Workflow</DialogTitle>
          <DialogDescription>
            We noticed some patterns that might benefit from context. This is your opportunity to explain your process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <FiAlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Providing context helps reviewers understand your authentic workflow and prevents misunderstandings.
            </AlertDescription>
          </Alert>

          <div>
            <h4 className="font-semibold mb-2">Highlighted Observations</h4>
            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded border">
                <p className="text-sm font-medium">Multiple paste operations detected</p>
                <p className="text-xs text-slate-500 mt-1">Context needed: Were you referencing documentation or previous work?</p>
              </div>
              <div className="bg-slate-50 p-3 rounded border">
                <p className="text-sm font-medium">Brief window switching pattern</p>
                <p className="text-xs text-slate-500 mt-1">Context needed: What resources were you consulting?</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Your Explanation</Label>
            <Textarea
              placeholder="Example: I referenced the official React documentation for the useEffect hook syntax, and pasted a utility function from my personal library that I wrote last month..."
              rows={6}
            />
            <p className="text-xs text-slate-500 mt-2">
              Helpful prompts: What were you looking at? Why did you need it? How did it help your solution?
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm text-green-800">
              This explanation will be shared with reviewers alongside your code. Clear context leads to fair evaluation.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowExplanationModal(false)}>
            Add Context Later
          </Button>
          <Button onClick={() => {
            setShowExplanationModal(false)
            showNotification('success', 'Explanation submitted successfully')
          }}>
            Submit Explanation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Screen 5: Company Review Dashboard
  const CompanyReview = () => {
    const [selectedSubmission, setSelectedSubmission] = useState<string>('SUB-001')

    const mockSubmissions = [
      {
        id: 'SUB-001',
        student: { name: 'Alex Chen', avatar_url: '/avatars/alex.jpg', trust_score: 78 },
        task: 'React Component Library',
        submitted: '2 hours ago',
        status: 'pending',
        needsContext: true,
      },
      {
        id: 'SUB-002',
        student: { name: 'Jordan Smith', avatar_url: '/avatars/jordan.jpg', trust_score: 85 },
        task: 'API Integration',
        submitted: '4 hours ago',
        status: 'pending',
        needsContext: false,
      },
    ]

    return (
      <div>
        {/* Fairness Reminder Banner */}
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <FiShield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <strong>Fairness Reminder:</strong> Use neutral language. Require 3+ patterns before trust impact. Students can explain and appeal all decisions.
          </AlertDescription>
        </Alert>

        <div className="flex gap-6">
          {/* Candidate Queue */}
          <div className="w-80 space-y-3">
            <h3 className="font-semibold mb-4">Pending Reviews ({mockSubmissions.length})</h3>
            {mockSubmissions.map((submission) => (
              <Card
                key={submission.id}
                className={`cursor-pointer transition-all ${selectedSubmission === submission.id ? 'border-blue-500 shadow-md' : ''}`}
                onClick={() => setSelectedSubmission(submission.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={submission.student.avatar_url} />
                      <AvatarFallback>{submission.student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{submission.student.name}</p>
                      <p className="text-xs text-slate-500">{submission.task}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">Trust: {submission.student.trust_score}</Badge>
                        {submission.needsContext && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Needs Context</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{submission.submitted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail View */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Code Quality Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Code Quality Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Overall Quality</span>
                        <span className="font-bold">92/100</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Strengths</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-green-500 mt-0.5" size={14} />
                          <span>Clean component architecture</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FiCheckCircle className="text-green-500 mt-0.5" size={14} />
                          <span>Strong TypeScript typing</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Areas for Improvement</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <FiAlertCircle className="text-blue-500 mt-0.5" size={14} />
                          <span>Consider error boundary implementation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Behavior Context Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Behavioral Context</CardTitle>
                  <CardDescription className="text-xs">CONTEXT - NOT JUDGMENT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                      <p className="text-sm font-medium">Pattern Requires Context</p>
                      <p className="text-xs text-slate-600 mt-1">Multiple paste operations detected during implementation</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border">
                      <p className="text-xs font-semibold mb-2">Student Explanation:</p>
                      <p className="text-xs text-slate-700 italic">
                        "I referenced the official React documentation for useEffect syntax and pasted a utility function from my personal library that I created last month for form validation."
                      </p>
                    </div>

                    <Alert className="bg-green-50 border-green-200">
                      <FiCheckCircle className="h-3 w-3 text-green-600" />
                      <AlertDescription className="text-xs text-green-800">
                        Student proactively provided context
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Code Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Submitted Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded max-h-64 overflow-y-auto">
                  <pre>{`import React, { useState, useEffect } from 'react'

interface ComponentProps {
  data: DataType[]
  onUpdate: (item: DataType) => void
}

export const MyComponent: React.FC<ComponentProps> = ({ data, onUpdate }) => {
  const [items, setItems] = useState<DataType[]>(data)

  useEffect(() => {
    // Sync with external data
    setItems(data)
  }, [data])

  return (
    <div className="component-wrapper">
      {items.map(item => (
        <ItemCard key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  )
}`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Decision Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Review Decision</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                    showNotification('success', 'Submission approved as independent work')
                  }}>
                    <FiCheckCircle className="mr-2" />
                    Approve - Independent
                  </Button>
                  <Button variant="outline" className="border-green-600 text-green-700" onClick={() => {
                    showNotification('success', 'Submission approved with assistance noted')
                  }}>
                    <FiCheckCircle className="mr-2" />
                    Approve - With Assistance
                  </Button>
                  <Button variant="outline" onClick={() => setShowExplanationModal(true)}>
                    <FiMessageSquare className="mr-2" />
                    Request Clarification
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-700" onClick={() => {
                    setCurrentScreen('defense-session')
                  }}>
                    <FiVideo className="mr-2" />
                    Offer Defense
                  </Button>
                  <Button
                    variant="destructive"
                    className="col-span-2"
                    onClick={() => setShowNegativeActionModal(true)}
                  >
                    <FiAlertCircle className="mr-2" />
                    Reject Submission
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Screen 6: Negative Action Confirmation Modal
  const NegativeActionModal = () => (
    <Dialog open={showNegativeActionModal} onOpenChange={setShowNegativeActionModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-600">Confirm Negative Decision</DialogTitle>
          <DialogDescription>
            This action will affect the student's trust score and requires careful justification.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <FiAlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This decision will reduce the student's trust score. Ensure you have sufficient evidence and have followed fairness guidelines.
            </AlertDescription>
          </Alert>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-sm">Impact Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Trust Score:</span>
                  <span className="font-bold">78</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Projected Impact:</span>
                  <span className="font-bold">-5 to -10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>New Score Range:</span>
                  <span className="font-bold">68-73</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label className="mb-2 block">Pattern Requirement Check</Label>
            <Alert className={`bg-red-50 border-red-200`}>
              <FiX className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Confirmed issues: 1/3 minimum required</strong>
                <p className="text-xs mt-1">You must document at least 3 distinct patterns before proceeding with a negative decision.</p>
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <Label className="mb-2 block">Student Context Summary</Label>
            <div className="bg-slate-50 p-3 rounded border text-sm">
              <p className="italic">"I referenced React documentation and used my personal utility library..."</p>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Justification (Required)</Label>
            <Textarea
              placeholder="Provide detailed justification for this decision. Include specific patterns observed, evidence gathered, and why student's explanation is insufficient..."
              rows={6}
              required
            />
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <FiAlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Student Rights:</strong> The student will have 48 hours to respond or request an oral defense session. All context will be shared transparently.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNegativeActionModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => {
            setShowNegativeActionModal(false)
            showNotification('info', 'Decision recorded. Student notified with appeal rights.')
          }}>
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Screen 7: Oral Defense Session
  const DefenseSession = () => {
    const [sessionActive, setSessionActive] = useState(false)

    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b px-6 py-4">
          <h2 className="text-xl font-bold">Authenticity Upgrade Session</h2>
          <p className="text-sm text-slate-500">React Component Library Task - Alex Chen</p>
        </div>

        <Alert className="mx-6 mt-6 bg-green-50 border-green-200">
          <FiCheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Supportive Environment:</strong> This is an opportunity to demonstrate your understanding and upgrade your verification status. Take your time and explain your thought process.
          </AlertDescription>
        </Alert>

        <div className="flex-1 flex gap-6 p-6">
          {/* Video Feed */}
          <div className="flex-1 space-y-4">
            <Card className="h-96">
              <CardContent className="p-0 h-full bg-slate-900 rounded-lg flex items-center justify-center">
                {!sessionActive ? (
                  <div className="text-center">
                    <FiVideo size={64} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-white mb-4">Defense session ready to start</p>
                    <Button onClick={() => setSessionActive(true)}>
                      <FiPlay className="mr-2" />
                      Start Session
                    </Button>
                  </div>
                ) : (
                  <div className="text-white">
                    <p>Video feed active</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Code Reference Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Code Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded max-h-48 overflow-y-auto">
                  <pre>{`// Lines 15-25 highlighted for discussion
const handleSubmit = async (data: FormData) => {
  try {
    const result = await validateForm(data)
    if (result.valid) {
      onSubmit(result.data)
    }
  } catch (error) {
    handleError(error)
  }
}`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interaction Panel */}
          <div className="w-96 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Session Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">Questions Discussed</span>
                      <span className="text-xs font-bold">2/5</span>
                    </div>
                    <Progress value={40} className="h-1.5" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Duration: 12:34 / 30:00
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Discussion Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Question 1</span>
                    <Badge className="bg-green-600 text-xs">Completed</Badge>
                  </div>
                  <p className="text-xs">Explain your component state management approach</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Question 2</span>
                    <Badge className="bg-blue-600 text-xs">Active</Badge>
                  </div>
                  <p className="text-xs">Walk through your form validation logic</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Question 3</span>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                  <p className="text-xs">Discuss error handling strategy</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Live Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Make live code edits here to demonstrate understanding..."
                  rows={6}
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-sm text-green-700">Success Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Upgrade to "Verified Independent Work"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Trust score improvement (+3-5 points)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-500 mt-0.5" size={14} />
                    <span>Receipt updated with defense badge</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {sessionActive && (
              <Button className="w-full" onClick={() => {
                showNotification('success', 'Defense session completed successfully! Verification upgraded.')
                setTimeout(() => setCurrentScreen('skill-receipt'), 2000)
              }}>
                Complete Session
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Component: Receipt Card
  const ReceiptCard = ({ receipt, compact = false }: { receipt: SkillReceipt, compact?: boolean }) => (
    <Card className={`hover:shadow-md transition-shadow ${compact ? '' : 'cursor-pointer'}`} onClick={() => {
      if (!compact) {
        setSelectedReceipt(receipt.receipt_id)
      }
    }}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
              <FiCode size={20} className="text-slate-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{receipt.task.title}</h4>
              <p className="text-xs text-slate-500">{receipt.task.company}</p>
            </div>
          </div>
          <Badge className={
            receipt.verification_status === 'verified_independent'
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
          }>
            {receipt.verification_status === 'verified_independent' ? 'Independent' : 'With Assistance'}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {receipt.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <FiStar className="text-yellow-500" size={14} />
              {receipt.scores.overall}/100
            </span>
            <span className="text-slate-400">
              {new Date(receipt.timestamp).toLocaleDateString()}
            </span>
          </div>
          {!compact && (
            <Button size="sm" variant="ghost">
              <FiEye size={14} className="mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Screen 8: Skill Receipt Page
  const SkillReceipt = () => {
    const receipt = mockReceipts[0]

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentScreen('student-dashboard')}>
            <FiChevronRight className="rotate-180 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <FiDownload className="mr-2" />
              Download PDF
            </Button>
            <Button>
              <FiShare2 className="mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Certificate-style Receipt */}
        <Card className="border-2 border-green-200 shadow-xl">
          <CardContent className="p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <FiAward size={40} className="text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">Verified Skill Receipt</h1>
              <p className="text-slate-500">Certificate of Authentic Skill Demonstration</p>
            </div>

            {/* Authenticity Badge */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8 text-center">
              <Badge className="bg-green-600 text-white mb-3 text-lg px-4 py-2">
                <FiCheckCircle className="mr-2" size={20} />
                Verified Independent Work
              </Badge>
              {receipt.defense_upgrade && (
                <div className="mt-3">
                  <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                    <FiVideo className="mr-1" size={14} />
                    Defense Upgrade: {receipt.defense_upgrade.date}
                  </Badge>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Avatar className="w-16 h-16">
                <AvatarImage src={receipt.student.avatar_url} />
                <AvatarFallback>{receipt.student.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold">{receipt.student.name}</h3>
                <p className="text-slate-500">Student ID: {receipt.student.id}</p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Task Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-2">Task Completed</h4>
                <p className="text-lg">{receipt.task.title}</p>
                <p className="text-slate-500">{receipt.task.company}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills Verified</h4>
                <div className="flex flex-wrap gap-2">
                  {receipt.skills.map((skill) => (
                    <Badge key={skill} className="bg-blue-100 text-blue-800">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{receipt.scores.code_quality}</p>
                <p className="text-xs text-slate-500">Code Quality</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{receipt.scores.problem_solving}</p>
                <p className="text-xs text-slate-500">Problem Solving</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{receipt.scores.technical_skill}</p>
                <p className="text-xs text-slate-500">Technical Skill</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{receipt.scores.overall}</p>
                <p className="text-xs text-slate-500">Overall</p>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiMessageSquare size={16} />
                AI Evaluation Feedback
              </h4>
              <p className="text-sm text-slate-700">{receipt.ai_feedback}</p>
            </div>

            <Separator className="my-8" />

            {/* Verification Footer */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2">VERIFICATION DETAILS</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Receipt ID:</strong> {receipt.receipt_id}</p>
                  <p><strong>Hash:</strong> <span className="font-mono text-xs">{receipt.receipt_hash}</span></p>
                  <p><strong>Issued:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
                  <p><strong>Public URL:</strong> <a href={receipt.public_url} className="text-blue-600 hover:underline">{receipt.public_url}</a></p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs text-slate-400">QR Code</span>
                </div>
                <p className="text-xs text-slate-500">Scan to verify authenticity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Share Bar */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Share Your Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <FiShare2 className="mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" className="flex-1">
                  <FiShare2 className="mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="flex-1">
                  <FiCopy className="mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" className="flex-1">
                  <FiCode className="mr-2" />
                  Embed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Screen 9: Public Portfolio Page
  const PublicPortfolio = () => {
    const portfolio: StudentPortfolio = {
      student_id: 'STU-001',
      name: 'Alex Chen',
      avatar_url: '/avatars/alex.jpg',
      bio: 'Full-stack developer passionate about building scalable web applications',
      trust_score: 78,
      verification_badge: 'Established',
      total_receipts: mockReceipts.length,
      receipts: mockReceipts,
      skills: [
        { skill: 'React', level: 85, receipts_count: 3, progression: [] },
        { skill: 'TypeScript', level: 78, receipts_count: 2, progression: [] },
        { skill: 'Node.js', level: 72, receipts_count: 2, progression: [] },
      ],
      timeline: [
        { date: '2026-02-05', event: 'Completed React Component task', receipt_id: 'RCP-2026-001' },
        { date: '2026-02-03', event: 'Defense upgrade for API Integration', receipt_id: 'RCP-2026-002' },
      ],
      public: true,
    }

    return (
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={portfolio.avatar_url} />
                  <AvatarFallback>{portfolio.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{portfolio.name}</h1>
                    <Badge className="bg-green-100 text-green-800">
                      <FiCheckCircle className="mr-1" size={14} />
                      {portfolio.verification_badge}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-3">{portfolio.bio}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FiAward className="text-blue-500" />
                      <strong>{portfolio.total_receipts}</strong> Verified Receipts
                    </span>
                    <span className="flex items-center gap-1">
                      <FiShield className="text-green-500" />
                      Trust Score: <strong>{portfolio.trust_score}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <FiShare2 className="mr-2" />
                  Share Portfolio
                </Button>
                <Button variant="outline">
                  <FiDownload className="mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="receipts">Receipts ({portfolio.total_receipts})</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Skill Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.skills.map((skill) => (
                      <div key={skill.skill}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{skill.skill}</span>
                          <span className="text-sm text-slate-500">{skill.level}/100</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">{skill.receipts_count} receipts</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Receipts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {portfolio.receipts.slice(0, 3).map((receipt) => (
                    <div key={receipt.receipt_id} className="border-l-4 border-green-500 pl-3">
                      <p className="font-semibold text-sm">{receipt.task.title}</p>
                      <p className="text-xs text-slate-500">{receipt.task.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">Score: {receipt.scores.overall}</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {receipt.verification_status === 'verified_independent' ? 'Independent' : 'With Assistance'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="receipts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.receipts.map((receipt) => (
                <ReceiptCard key={receipt.receipt_id} receipt={receipt} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.skills.map((skill) => (
                <Card key={skill.skill}>
                  <CardHeader>
                    <CardTitle className="text-base">{skill.skill}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold text-blue-600">{skill.level}</p>
                      <p className="text-xs text-slate-500">Proficiency Level</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-600">Receipts:</span>
                        <strong>{skill.receipts_count}</strong>
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Progression
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {portfolio.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {idx < portfolio.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="font-medium">{event.event}</p>
                        {event.receipt_id && (
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View Receipt <FiExternalLink className="ml-1" size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Screen 10: Trust & Improvement Center
  const TrustCenter = () => {
    return (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Trust & Improvement Center</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Trust Score Display */}
          <div className="md:col-span-1">
            <TrustScoreWidget score={mockTrustScore} />
          </div>

          {/* Score Breakdown */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>How your trust score is calculated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrustScore.breakdown.map((factor) => (
                    <div key={factor.factor}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{factor.factor}</span>
                        <span className="text-sm text-slate-500">
                          {factor.contribution} pts (Weight: {factor.weight * 100}%)
                        </span>
                      </div>
                      <Progress value={(factor.contribution / mockTrustScore.score) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Improvement Pathways */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Improvement Pathways</CardTitle>
            <CardDescription>Actions you can take to improve your trust score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTrustScore.improvement_paths.map((path, idx) => (
                <Card key={idx} className="border-blue-200">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiTarget size={24} className="text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">+{path.projected_impact}</p>
                      <p className="text-xs text-slate-500">points</p>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">{path.action}</h4>
                    <p className="text-xs text-slate-600">{path.description}</p>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Start
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* History Timeline */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Trust Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTrustScore.history.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-2">
                  <div>
                    <p className="font-medium text-sm">{entry.event}</p>
                    <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{entry.score}</p>
                    {idx > 0 && (
                      <p className={`text-xs ${entry.score > mockTrustScore.history[idx - 1].score ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.score > mockTrustScore.history[idx - 1].score ? '+' : ''}
                        {entry.score - mockTrustScore.history[idx - 1].score}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Items & Appeals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pending Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <FiCheckCircle size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No pending items</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appeals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <FiCheckCircle size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No active appeals</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Screen 11: Company Task Creation
  const CompanyCreateTask = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 5

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-24 h-1 ${step < currentStep ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Basics</span>
            <span>Requirements</span>
            <span>Parameters</span>
            <span>Criteria</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Step 1: Basic Information</h3>
                <div>
                  <Label>Task Title</Label>
                  <Input placeholder="e.g., Build React Dashboard Component" className="mt-1" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Detailed task description..." rows={4} className="mt-1" />
                </div>
                <div>
                  <Label>Skills Required</Label>
                  <Input placeholder="React, TypeScript, CSS (comma separated)" className="mt-1" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Step 2: Requirements & Constraints</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Difficulty Level</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input type="number" placeholder="180" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Constraints</Label>
                  <Textarea placeholder="List any specific constraints or requirements..." rows={4} className="mt-1" />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Step 3: Dynamic Parameters</h3>
                <Alert className="bg-blue-50 border-blue-200">
                  <FiAlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Dynamic parameters create unique task variants for each student, ensuring fairness.
                  </AlertDescription>
                </Alert>
                <div className="space-y-3">
                  <Card className="border-dashed">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-sm">Parameter 1: Dataset Theme</p>
                        <Button variant="ghost" size="sm">
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Parameter type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="random_string">Random String</SelectItem>
                            <SelectItem value="random_number">Random Number</SelectItem>
                            <SelectItem value="random_dataset">Random Dataset</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Options (comma separated)" />
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline" className="w-full">
                    <FiPlusCircle className="mr-2" />
                    Add Parameter
                  </Button>
                </div>
                <div>
                  <Label>Preview Variant</Label>
                  <div className="bg-slate-50 border rounded p-4 mt-2">
                    <p className="text-sm text-slate-600">Variant will be generated with: dataset_theme = "sales", chart_types = ["bar", "line"]</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Step 4: Evaluation Criteria</h3>
                <div className="space-y-3">
                  {['Code Organization', 'Functionality', 'Best Practices'].map((criterion, idx) => (
                    <Card key={idx} className="border-dashed">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <Input defaultValue={criterion} className="flex-1 mr-3" />
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Weight:</Label>
                            <Input type="number" defaultValue="30" className="w-20" />
                            <span className="text-xs text-slate-500">%</span>
                          </div>
                        </div>
                        <Textarea placeholder="Detailed description of this criterion..." rows={2} />
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <FiPlusCircle className="mr-2" />
                    Add Criterion
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Step 5: Review Guidelines & Fairness</h3>
                <Alert className="bg-green-50 border-green-200">
                  <FiShield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Review guidelines help ensure fair and consistent evaluation of all submissions.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="fairness1" defaultChecked />
                    <label htmlFor="fairness1" className="text-sm">Use neutral, non-accusatory language in all reviews</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="fairness2" defaultChecked />
                    <label htmlFor="fairness2" className="text-sm">Require 3+ patterns before trust score impact</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="fairness3" defaultChecked />
                    <label htmlFor="fairness3" className="text-sm">Offer oral defense opportunities</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="fairness4" defaultChecked />
                    <label htmlFor="fairness4" className="text-sm">Share all behavioral context with students</label>
                  </div>
                </div>
                <div>
                  <Label>Additional Review Guidelines</Label>
                  <Textarea placeholder="Any specific instructions for reviewers..." rows={4} className="mt-1" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < totalSteps ? (
            <Button onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}>
              Next
            </Button>
          ) : (
            <Button onClick={() => {
              showNotification('success', 'Task created successfully!')
              setTimeout(() => setCurrentScreen('company-review'), 2000)
            }}>
              Create Task
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Screen 12: Recruiter Comparison View
  const RecruiterCompare = () => {
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>(['STU-001', 'STU-002'])

    const mockCandidates = [
      {
        student_id: 'STU-001',
        name: 'Alex Chen',
        avatar_url: '/avatars/alex.jpg',
        trust_score: 78,
        total_receipts: 5,
        skills: ['React', 'TypeScript', 'Node.js'],
        top_scores: [92, 88, 85],
        portfolio_url: 'https://proofly.io/portfolio/STU-001',
      },
      {
        student_id: 'STU-002',
        name: 'Jordan Smith',
        avatar_url: '/avatars/jordan.jpg',
        trust_score: 85,
        total_receipts: 7,
        skills: ['Python', 'Django', 'PostgreSQL'],
        top_scores: [95, 89, 87],
        portfolio_url: 'https://proofly.io/portfolio/STU-002',
      },
      {
        student_id: 'STU-003',
        name: 'Sam Taylor',
        avatar_url: '/avatars/sam.jpg',
        trust_score: 72,
        total_receipts: 4,
        skills: ['React', 'Node.js', 'MongoDB'],
        top_scores: [88, 85, 82],
        portfolio_url: 'https://proofly.io/portfolio/STU-003',
      },
    ]

    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Compare Candidates</h2>
          <div className="flex gap-2">
            <Button variant="outline">
              <FiDownload className="mr-2" />
              Export Comparison
            </Button>
            <Button>
              <FiPlusCircle className="mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Candidate Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Select Candidates to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Search by name or paste portfolio URL..." className="flex-1" />
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Metric</th>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      return candidate ? (
                        <th key={id} className="text-center p-4">
                          <div className="flex flex-col items-center gap-2">
                            <Avatar>
                              <AvatarImage src={candidate.avatar_url} />
                              <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{candidate.name}</p>
                              <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                                View Portfolio
                              </Button>
                            </div>
                          </div>
                        </th>
                      ) : null
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-sm">Trust Score</td>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      return candidate ? (
                        <td key={id} className="text-center p-4">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold">{candidate.trust_score}</span>
                            <Badge className="bg-green-100 text-green-800 mt-1">Established</Badge>
                          </div>
                        </td>
                      ) : null
                    })}
                  </tr>
                  <tr className="border-b bg-slate-50">
                    <td className="p-4 font-medium text-sm">Total Receipts</td>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      return candidate ? (
                        <td key={id} className="text-center p-4">
                          <span className="text-xl font-semibold">{candidate.total_receipts}</span>
                        </td>
                      ) : null
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-sm">Top Skills</td>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      return candidate ? (
                        <td key={id} className="text-center p-4">
                          <div className="flex flex-wrap justify-center gap-1">
                            {candidate.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </td>
                      ) : null
                    })}
                  </tr>
                  <tr className="border-b bg-slate-50">
                    <td className="p-4 font-medium text-sm">Average Score</td>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      const avgScore = candidate ? Math.round(candidate.top_scores.reduce((a, b) => a + b, 0) / candidate.top_scores.length) : 0
                      return candidate ? (
                        <td key={id} className="text-center p-4">
                          <span className="text-xl font-semibold">{avgScore}</span>
                          <span className="text-sm text-slate-500">/100</span>
                        </td>
                      ) : null
                    })}
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium text-sm">Top Scores</td>
                    {selectedCandidates.map((id) => {
                      const candidate = mockCandidates.find(c => c.student_id === id)
                      return candidate ? (
                        <td key={id} className="text-center p-4">
                          <div className="flex justify-center gap-2">
                            {candidate.top_scores.map((score, idx) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800">{score}</Badge>
                            ))}
                          </div>
                        </td>
                      ) : null
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCandidates.map((id) => {
              const candidate = mockCandidates.find(c => c.student_id === id)
              return candidate ? (
                <Card key={id}>
                  <CardHeader>
                    <CardTitle className="text-base">{candidate.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FiEye className="mr-2" size={14} />
                        View Full Portfolio
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FiDownload className="mr-2" size={14} />
                        Download Resume
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FiX className="mr-2" size={14} />
                        Remove from Comparison
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null
            })}
          </div>
        </div>
      </div>
    )
  }

  // Main Render
  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationSidebar />
      <ExplanationModal />
      <NegativeActionModal />

      {/* Mobile Menu Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 lg:hidden bg-slate-900 text-white p-3 rounded-lg shadow-lg"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'} p-6`}>
        {/* Inline Notification */}
        {notification && (
          <Alert className={`mb-6 ${
            notification.type === 'success' ? 'bg-green-50 border-green-200' :
            notification.type === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            {notification.type === 'success' && <FiCheckCircle className="h-4 w-4 text-green-600" />}
            {notification.type === 'error' && <FiX className="h-4 w-4 text-red-600" />}
            {notification.type === 'info' && <FiAlertCircle className="h-4 w-4 text-blue-600" />}
            <AlertDescription className={
              notification.type === 'success' ? 'text-green-800' :
              notification.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }>
              {notification.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Screen Router */}
        {currentScreen === 'student-dashboard' && <StudentDashboard />}
        {currentScreen === 'task-marketplace' && <TaskMarketplace />}
        {currentScreen === 'task-execution' && <TaskExecution />}
        {currentScreen === 'company-review' && <CompanyReview />}
        {currentScreen === 'defense-session' && <DefenseSession />}
        {currentScreen === 'skill-receipt' && <SkillReceipt />}
        {currentScreen === 'public-portfolio' && <PublicPortfolio />}
        {currentScreen === 'trust-center' && <TrustCenter />}
        {currentScreen === 'company-create-task' && <CompanyCreateTask />}
        {currentScreen === 'recruiter-compare' && <RecruiterCompare />}
      </div>
    </div>
  )
}
