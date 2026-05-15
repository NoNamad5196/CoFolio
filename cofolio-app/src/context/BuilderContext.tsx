import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { BuilderState, PortfolioResult, TemplateType } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'cofolio.builder.v1'
const RESULT_KEY = 'cofolio.result.v1'

export const DEFAULT_BUILDER: BuilderState = {
  step: 0,
  profile: { name: '', role: '', location: '', bio: '' },
  projects: [],
  stack: { frontend: [], backend: [], ai: [], database: [], deploy: [] },
  about: { intro: '', career: '', goals: '' },
  template: 'developer' as TemplateType,
}

export function loadBuilder(): BuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_BUILDER
    return { ...DEFAULT_BUILDER, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_BUILDER
  }
}

export function saveBuilder(s: BuilderState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

// ── Slug generator ─────────────────────────────────────────────────────────────
async function generateUniqueSlug(name: string): Promise<string> {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9-]/g, '')
    || 'portfolio'

  let slug = base
  let n = 1

  while (true) {
    const { data } = await supabase
      .from('portfolios')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return slug
    if (n > 100) return `${base}-${crypto.randomUUID().slice(0, 8)}`
    slug = `${base}-${++n}`
  }
}

// ── Context types ──────────────────────────────────────────────────────────────
interface BuilderContextValue {
  state: BuilderState
  result: PortfolioResult | null
  update: (patch: Partial<BuilderState> | ((s: BuilderState) => BuilderState)) => void
  setResult: (r: PortfolioResult) => void
  reset: () => void
  fillExample: () => void
  saving: boolean
  savedSlug: string | null
  saveToSupabase: () => Promise<string | null>
  loadFromSupabase: () => Promise<void>
}

const BuilderCtx = createContext<BuilderContextValue>({
  state: DEFAULT_BUILDER,
  result: null,
  update: () => {},
  setResult: () => {},
  reset: () => {},
  fillExample: () => {},
  saving: false,
  savedSlug: null,
  saveToSupabase: async () => null,
  loadFromSupabase: async () => {},
})

function loadResult(): PortfolioResult | null {
  try {
    const raw = localStorage.getItem(RESULT_KEY)
    return raw ? (JSON.parse(raw) as PortfolioResult) : null
  } catch {
    return null
  }
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const [state, setState] = useState<BuilderState>(loadBuilder)
  const [result, setResultState] = useState<PortfolioResult | null>(loadResult)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  useEffect(() => { saveBuilder(state) }, [state])

  const update = useCallback(
    (patch: Partial<BuilderState> | ((s: BuilderState) => BuilderState)) => {
      setState((s) => (typeof patch === 'function' ? patch(s) : { ...s, ...patch }))
    },
    []
  )

  const setResult = useCallback((r: PortfolioResult) => {
    setResultState(r)
    try { localStorage.setItem(RESULT_KEY, JSON.stringify(r)) } catch {}
  }, [])

  const reset = useCallback(() => setState(DEFAULT_BUILDER), [])

  const fillExample = useCallback(() => setState({
    step: 3,
    profile: { name: '김근호', role: 'Frontend Developer', location: '서울', bio: '사용자 경험을 코드로 다듬는 3년차 프론트엔드' },
    projects: [
      { id: 1, title: 'Notewave', desc: '실시간 협업 노트 — OT 알고리즘으로 충돌 해결', role: 'Frontend Lead', github: 'github.com/u/notewave', deploy: 'notewave.app' },
      { id: 2, title: 'Mealy', desc: '벡터 검색 기반 AI 식단 추천', role: 'Full-stack', github: 'github.com/u/mealy', deploy: 'mealy.app' },
      { id: 3, title: 'DesignKit', desc: '토큰 기반 디자인 시스템 라이브러리', role: 'Maintainer', github: 'github.com/u/designkit', deploy: '' },
    ],
    stack: {
      frontend: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
      backend: ['Node.js', 'Express'],
      ai: ['OpenAI'],
      database: ['PostgreSQL', 'Prisma'],
      deploy: ['Vercel'],
    },
    about: {
      intro: '복잡한 정보를 정리해 보여주는 일을 좋아합니다.',
      career: '스타트업에서 3년간 디자인 시스템과 협업 도구를 만들었습니다.',
      goals: '사용자가 신뢰할 수 있는 인터페이스를 만들고 싶습니다.',
    },
    template: 'developer',
  }), [])

  // ── Save to Supabase ─────────────────────────────────────────────────────────
  const saveToSupabase = useCallback(async (): Promise<string | null> => {
    if (!user) return null
    setSaving(true)

    try {
      // Check if user already has a portfolio
      const { data: existing } = await supabase
        .from('portfolios')
        .select('id, slug')
        .eq('user_id', user.id)
        .maybeSingle()

      const builderData = state as unknown as Record<string, unknown>
      const resultData = result as unknown as Record<string, unknown> | null

      if (existing) {
        // Update existing portfolio
        const { error } = await supabase
          .from('portfolios')
          .update({ builder_state: builderData, portfolio_result: resultData })
          .eq('id', (existing as { id: string; slug: string }).id)
        if (error) throw error
        const slug = (existing as { id: string; slug: string }).slug
        setSavedSlug(slug)
        return slug
      } else {
        // Create new portfolio with unique slug
        const slug = await generateUniqueSlug(state.profile.name || 'portfolio')
        const { error } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            slug,
            builder_state: builderData,
            portfolio_result: resultData,
          })
        if (error) throw error
        setSavedSlug(slug)
        return slug
      }
    } catch (e) {
      console.error('[saveToSupabase]', e)
      return null
    } finally {
      setSaving(false)
    }
  }, [user, state, result])

  // ── Load from Supabase ───────────────────────────────────────────────────────
  const loadFromSupabase = useCallback(async () => {
    if (!user) return

    const { data } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data) {
      // No portfolio in DB → wipe any stale localStorage so fresh user sees blank state
      setState(DEFAULT_BUILDER)
      saveBuilder(DEFAULT_BUILDER)
      localStorage.removeItem(RESULT_KEY)
      setResultState(null)
      setSavedSlug(null)
      return
    }

    const portfolio = data as { builder_state: unknown; portfolio_result: unknown; slug: string }

    if (portfolio.builder_state) {
      const loaded = { ...DEFAULT_BUILDER, ...(portfolio.builder_state as BuilderState) }
      setState(loaded)
      saveBuilder(loaded)
    }
    if (portfolio.portfolio_result) {
      const r = portfolio.portfolio_result as PortfolioResult
      setResultState(r)
      try { localStorage.setItem(RESULT_KEY, JSON.stringify(r)) } catch {}
    }
    if (portfolio.slug) {
      setSavedSlug(portfolio.slug)
    }
  }, [user])

  return (
    <BuilderCtx.Provider value={{
      state, result, update, setResult, reset, fillExample,
      saving, savedSlug, saveToSupabase, loadFromSupabase,
    }}>
      {children}
    </BuilderCtx.Provider>
  )
}

export const useBuilder = () => useContext(BuilderCtx)
