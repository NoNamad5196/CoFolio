export type TemplateType = 'developer' | 'designer' | 'student'
export type TagTone = 'violet' | 'cyan' | 'indigo' | 'slate' | 'pink' | 'emerald'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type RoutePath = '/' | '/login' | '/builder' | '/generating' | '/result' | '/dashboard'

export interface BuilderProfile {
  name: string
  role: string
  location: string
  bio: string
}

export interface BuilderProject {
  id: number
  title: string
  desc: string
  role: string
  github: string
  deploy: string
}

export interface BuilderStack {
  frontend: string[]
  backend: string[]
  ai: string[]
  database: string[]
  deploy: string[]
}

export interface BuilderAbout {
  intro: string
  career: string
  goals: string
}

export interface BuilderState {
  step: number
  profile: BuilderProfile
  projects: BuilderProject[]
  stack: BuilderStack
  about: BuilderAbout
  template: TemplateType
}

export interface PortfolioTemplate {
  id: TemplateType
  name: string
  desc: string
  tags: string[]
}

export interface ShowcasePreviewStat {
  l: string
  v: string
  c: string
}

export interface ShowcaseProject {
  t: string
  d: string
  tags: string[]
  col: string
  myRole?: string
  problem?: string
  solution?: string
  result?: string
  learned?: string
  github?: string
  deploy?: string
}

export interface ShowcaseProfile {
  name: string
  initials: string
  bio: string
}

export interface ShowcasePortfolio {
  id: string
  title: string
  role: string
  themeLabel: string
  d: string
  description: string
  tags: string[]
  techStack: string[]
  thumb: string
  lines: number
  profile: ShowcaseProfile
  previewStats: ShowcasePreviewStat[]
  projects: ShowcaseProject[]
}

export interface PricingPlan {
  name: string
  price: string
  per: string
  desc: string
  features: string[]
  cta: string
  recommended: boolean
  tone: TagTone
}

export interface ExportFormat {
  id: string
  title: string
  desc: string
  icon: React.ReactNode
  badge?: string
}

export interface ExportTheme {
  id: string
  title: string
  sub: string
  swatch: string
}

export interface AnalysisMetric {
  l: string
  v: number
  c: string
}

export interface AIRecommendation {
  priority?: 'high' | 'medium' | 'low'
  text: string
  impact?: string
}

export interface ScoreBreakdown {
  label: string
  value: number
}

export interface PortfolioResult {
  score: number
  scoreBreakdown: ScoreBreakdown[]
  enhancedDescriptions: Record<number, string>
  interviewQuestions: string[]
  suggestions: string[]
  bioImproved: string
}
