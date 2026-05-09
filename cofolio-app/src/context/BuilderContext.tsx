import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { BuilderState, TemplateType } from '../types'

const STORAGE_KEY = 'cofolio.builder.v1'

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

interface BuilderContextValue {
  state: BuilderState
  update: (patch: Partial<BuilderState> | ((s: BuilderState) => BuilderState)) => void
  reset: () => void
  fillExample: () => void
}

const BuilderCtx = createContext<BuilderContextValue>({
  state: DEFAULT_BUILDER,
  update: () => {},
  reset: () => {},
  fillExample: () => {},
})

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BuilderState>(loadBuilder)

  useEffect(() => { saveBuilder(state) }, [state])

  const update = useCallback(
    (patch: Partial<BuilderState> | ((s: BuilderState) => BuilderState)) => {
      setState((s) => (typeof patch === 'function' ? patch(s) : { ...s, ...patch }))
    },
    []
  )

  const reset = useCallback(() => setState(DEFAULT_BUILDER), [])

  const fillExample = useCallback(() => setState({
    step: 3,
    profile: { name: '김지호', role: 'Frontend Developer', location: '서울', bio: '사용자 경험을 코드로 다듬는 3년차 프론트엔드' },
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

  return (
    <BuilderCtx.Provider value={{ state, update, reset, fillExample }}>
      {children}
    </BuilderCtx.Provider>
  )
}

export const useBuilder = () => useContext(BuilderCtx)
