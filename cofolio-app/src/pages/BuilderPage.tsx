import { Fragment, useState, useMemo } from 'react'
import type React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cn } from '../utils/cn'
import { useBuilder } from '../context/BuilderContext'
import { Section } from '../components/common/Section'
import { PrimaryBtn, GhostBtn } from '../components/common/Button'
import { Tag } from '../components/common/Tag'
import { Icon } from '../components/common/Icon'
import { WindowDots } from '../components/common/Card'
import type { TemplateType, BuilderState } from '../types'

// ── StepBar ──────────────────────────────────────────────────────────────────
const STEPS = ['프로필', '프로젝트', '기술스택', '마무리']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const active = i === current
        const done = i < current
        return (
          <Fragment key={s}>
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn(
                'grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold border',
                done ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' :
                active ? 'bg-violet-500/25 text-violet-100 border-violet-400/50' :
                'bg-white/5 text-slate-500 border-white/10'
              )}>
                {done ? <Icon name="check" size={12} /> : i + 1}
              </div>
              <div className={cn('hidden sm:block text-[12.5px]', active ? 'text-white font-semibold' : done ? 'text-slate-300' : 'text-slate-500')}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <div className={cn('h-px flex-1 min-w-[16px]', done ? 'bg-emerald-400/40' : 'bg-white/8')} />}
          </Fragment>
        )
      })}
    </div>
  )
}

// ── Form fields ───────────────────────────────────────────────────────────────
interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-slate-300">{label}</span>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && <div className="mt-1 text-[11.5px] text-rose-400">{error}</div>}
    </label>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn('h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none', props.className)}
    />
  )
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn('min-h-[88px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none leading-relaxed', props.className)}
    />
  )
}

// ── Step 0: Profile ───────────────────────────────────────────────────────────
interface StepProfileProps { state: BuilderState; update: (p: Partial<BuilderState>) => void; errors: Record<string, string> }

function StepProfile({ state, update, errors }: StepProfileProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[20px] font-bold tracking-tight">기본 프로필을 알려주세요</div>
        <div className="mt-1 text-[13px] text-slate-400">포트폴리오 상단에 표시될 정보입니다.</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="이름" error={errors.name}>
          <Input value={state.profile.name} onChange={(e) => update({ profile: { ...state.profile, name: e.target.value } })} placeholder="예: 김지호" />
        </Field>
        <Field label="역할 / 직무" error={errors.role}>
          <Input value={state.profile.role} onChange={(e) => update({ profile: { ...state.profile, role: e.target.value } })} placeholder="예: Frontend Developer" />
        </Field>
        <Field label="지역">
          <Input value={state.profile.location} onChange={(e) => update({ profile: { ...state.profile, location: e.target.value } })} placeholder="예: 서울" />
        </Field>
        <Field label="한 줄 소개" hint="50자 이내 권장">
          <Input value={state.profile.bio} onChange={(e) => update({ profile: { ...state.profile, bio: e.target.value } })} placeholder="예: 협업 도구를 만드는 3년차 프론트엔드" />
        </Field>
      </div>
    </div>
  )
}

// ── Step 1: Projects ──────────────────────────────────────────────────────────
interface StepProjectsProps { state: BuilderState; update: (p: Partial<BuilderState>) => void; errors: Record<string, string> }

function StepProjects({ state, update }: StepProjectsProps) {
  const addProject = () => update({ projects: [...state.projects, { id: Date.now(), title: '', desc: '', role: '', github: '', deploy: '' }] })
  const removeProject = (id: number) => update({ projects: state.projects.filter((p) => p.id !== id) })
  const updateProject = (id: number, patch: object) => update({ projects: state.projects.map((p) => p.id === id ? { ...p, ...patch } : p) })

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[20px] font-bold tracking-tight">대표 프로젝트를 입력하세요</div>
          <div className="mt-1 text-[13px] text-slate-400">선택 사항 — 아직 없다면 건너뛰어도 괜찮아요. AI가 설명을 자동으로 다듬어 드립니다.</div>
        </div>
        <button onClick={addProject} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 h-9 text-[12.5px] text-violet-100 hover:bg-violet-500/20">
          <Icon name="plus" size={12} /> 프로젝트 추가
        </button>
      </div>
      <div className="space-y-3">
        {state.projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-200 mb-3"><Icon name="folder" size={18} /></div>
            <div className="text-[14px] font-semibold text-slate-200">아직 등록된 프로젝트가 없어요</div>
            <div className="mt-1 text-[12.5px] text-slate-500 leading-relaxed">프로젝트가 아직 없어도 괜찮아요.<br />자기소개와 기술스택으로도 멋진 포트폴리오를 만들 수 있습니다.</div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button onClick={addProject} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 h-9 text-[12.5px] text-violet-100 hover:bg-violet-500/20">
                <Icon name="plus" size={12} /> 프로젝트 추가하기
              </button>
              <span className="text-[11.5px] text-slate-500">또는 그대로 다음으로</span>
            </div>
          </div>
        )}
        {state.projects.map((p, i) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <div className="text-[12px] uppercase tracking-[0.18em] text-violet-300/80 font-mono">Project {String(i + 1).padStart(2, '0')}</div>
              <button onClick={() => removeProject(p.id)} className="text-[12px] text-slate-500 hover:text-rose-400 inline-flex items-center gap-1">
                <Icon name="x" size={12} /> 삭제
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="프로젝트명"><Input value={p.title} onChange={(e) => updateProject(p.id, { title: e.target.value })} placeholder="예: Notewave" /></Field>
              <Field label="담당 역할"><Input value={p.role} onChange={(e) => updateProject(p.id, { role: e.target.value })} placeholder="예: Frontend Lead" /></Field>
              <div className="sm:col-span-2">
                <Field label="설명" hint="문제 → 해결 과정 → 결과 순으로 적으면 좋아요">
                  <Textarea value={p.desc} onChange={(e) => updateProject(p.id, { desc: e.target.value })} placeholder="이 프로젝트가 해결하려던 문제와 본인이 한 일을 적어주세요" />
                </Field>
              </div>
              <Field label="GitHub 링크"><Input value={p.github} onChange={(e) => updateProject(p.id, { github: e.target.value })} placeholder="github.com/..." /></Field>
              <Field label="배포 링크"><Input value={p.deploy} onChange={(e) => updateProject(p.id, { deploy: e.target.value })} placeholder="https://..." /></Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Stack ─────────────────────────────────────────────────────────────
const STACK_GROUPS = [
  { key: 'frontend', label: 'Frontend', suggest: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Vue', 'Svelte', 'Vite'], tone: 'violet' },
  { key: 'backend', label: 'Backend', suggest: ['Node.js', 'Express', 'Spring Boot', 'Django', 'FastAPI', 'GraphQL'], tone: 'indigo' },
  { key: 'ai', label: 'AI', suggest: ['OpenAI', 'LangChain', 'RAG', 'Pytorch'], tone: 'cyan' },
  { key: 'database', label: 'Database', suggest: ['PostgreSQL', 'MySQL', 'MongoDB', 'Prisma', 'Redis', 'pgvector'], tone: 'emerald' },
  { key: 'deploy', label: 'Deploy', suggest: ['Vercel', 'AWS', 'Docker', 'GitHub Actions', 'Cloudflare'], tone: 'pink' },
] as const

interface StackGroupProps {
  g: typeof STACK_GROUPS[number]
  selected: string[]
  toggle: (group: string, item: string) => void
  addCustom: (group: string, value: string) => void
}

function StackGroup({ g, selected, toggle, addCustom }: StackGroupProps) {
  const [val, setVal] = useState('')
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Tag tone={g.tone as any}>{g.label}</Tag>
        <span className="text-[11px] text-slate-500">{selected.length}개 선택</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[...new Set([...g.suggest, ...selected])].map((t) => {
          const on = selected.includes(t)
          return (
            <button
              key={t}
              onClick={() => toggle(g.key, t)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-[12px] font-mono transition',
                on ? 'border-violet-400/50 bg-violet-500/20 text-violet-100' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
              )}
            >
              {on && '✓ '}{t}
            </button>
          )
        })}
        <form
          onSubmit={(e) => { e.preventDefault(); if (val.trim()) { addCustom(g.key, val); setVal('') } }}
          className="inline-flex items-center gap-1"
        >
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="+ 직접 추가"
            className="h-7 w-28 rounded-md border border-dashed border-white/15 bg-transparent px-2 text-[12px] text-slate-300 placeholder:text-slate-500 focus:border-violet-400/50 outline-none"
          />
          {val.trim() && (
            <button
              type="submit"
              className="h-7 w-7 rounded-md border border-violet-400/40 bg-violet-500/20 text-violet-200 text-[14px] font-bold hover:bg-violet-500/35 flex items-center justify-center"
              aria-label="추가"
            >
              +
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

interface StepStackProps { state: BuilderState; update: (patch: Partial<BuilderState> | ((s: BuilderState) => BuilderState)) => void }

function StepStack({ state, update }: StepStackProps) {
  const toggle = (group: string, item: string) => {
    const cur = (state.stack as any)[group] as string[] || []
    const next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item]
    update({ stack: { ...state.stack, [group]: next } })
  }
  const addCustom = (group: string, value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    update((s) => {
      const cur = ((s.stack as any)[group] as string[]) || []
      if (cur.includes(trimmed)) return s
      return { ...s, stack: { ...s.stack, [group]: [...cur, trimmed] } }
    })
  }
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[20px] font-bold tracking-tight">사용한 기술스택을 선택하세요</div>
        <div className="mt-1 text-[13px] text-slate-400">카테고리별로 자동 분류됩니다. 직접 입력도 가능합니다.</div>
      </div>
      <div className="space-y-3">
        {STACK_GROUPS.map((g) => {
          const selected = (state.stack as any)[g.key] as string[] || []
          return <StackGroup key={g.key} g={g} selected={selected} toggle={toggle} addCustom={addCustom} />
        })}
      </div>
    </div>
  )
}

// ── Step 3: Finalize ──────────────────────────────────────────────────────────
const TEMPLATE_OPTIONS = [
  { id: 'developer' as TemplateType, t: 'Developer', d: '프로젝트와 기술스택 강조', tone: 'violet' },
  { id: 'designer' as TemplateType, t: 'Designer', d: '비주얼과 케이스 스터디 강조', tone: 'cyan' },
  { id: 'student' as TemplateType, t: 'Student', d: '학업·활동·공모전 균형', tone: 'indigo' },
] as const

interface StepFinalizeProps { state: BuilderState; update: (p: Partial<BuilderState>) => void }

function StepFinalize({ state, update }: StepFinalizeProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const navigate = useNavigate()
  const allStack = Object.values(state.stack).flat()

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[20px] font-bold tracking-tight">자기소개와 템플릿을 마무리하세요</div>
        <div className="mt-1 text-[13px] text-slate-400">AI가 문장을 더 자연스럽게 다듬어 드립니다.</div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Field label="자기소개" hint="AI가 다듬어 줍니다">
          <Textarea value={state.about.intro} onChange={(e) => update({ about: { ...state.about, intro: e.target.value } })} placeholder="어떤 일을 좋아하고, 무엇에 집중하는지 적어주세요" />
        </Field>
        <Field label="경력 / 활동">
          <Textarea value={state.about.career} onChange={(e) => update({ about: { ...state.about, career: e.target.value } })} placeholder="회사, 동아리, 학회, 활동 등을 자유롭게 적어주세요" />
        </Field>
        <Field label="목표 / 관심사">
          <Textarea value={state.about.goals} onChange={(e) => update({ about: { ...state.about, goals: e.target.value } })} placeholder="앞으로 어떤 일을 하고 싶은지 적어주세요" />
        </Field>
      </div>

      <div>
        <div className="text-[12.5px] text-slate-300 mb-2">템플릿 선택</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ template: t.id })}
              className={cn(
                'text-left rounded-2xl border p-4 transition',
                state.template === t.id ? 'border-violet-400/50 bg-violet-500/10 ring-grad' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
              )}
            >
              <Tag tone={t.tone as any}>{t.t}</Tag>
              <div className="mt-2 text-[14px] font-semibold">{t.t} 템플릿</div>
              <div className="mt-1 text-[12px] text-slate-400">{t.d}</div>
              {state.template === t.id && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-violet-200">
                  <Icon name="check" size={11} /> 선택됨
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-violet-400/25 bg-violet-500/[0.06] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-500/20 text-violet-200"><Icon name="eye" size={16} /></div>
          <div>
            <div className="text-[13.5px] font-semibold text-slate-100">생성 전에 미리보기</div>
            <div className="text-[11.5px] text-slate-400 mt-0.5">지금까지 입력한 내용으로 만들어질 포트폴리오를 미리 확인해 보세요.</div>
          </div>
        </div>
        <GhostBtn size="sm" onClick={() => setPreviewOpen(true)}>
          <Icon name="eye" size={13} /> 미리보기 열기
        </GhostBtn>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
          style={{ animation: 'fadeIn .2s ease' }}
          onClick={() => setPreviewOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <div
            className="relative w-full max-w-[820px] max-h-[88vh] overflow-hidden rounded-2xl glass-strong ring-grad glow-violet flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'popIn .28s cubic-bezier(.2,.7,.2,1)' }}
          >
            <div className="flex items-start justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/8">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-violet-300/90">PREVIEW</div>
                <div className="mt-1 text-[18px] font-bold tracking-tight">생성될 포트폴리오 미리보기</div>
                <div className="text-[11.5px] text-slate-400 mt-0.5">아직 AI가 다듬기 전 — 실제 결과는 더 자연스럽게 정돈됩니다.</div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="닫기"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              >
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto nosb p-5 sm:p-7 space-y-4">
              <div className="rounded-xl border border-white/10 bg-ink-900/40 overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2 bg-ink-900/60">
                  <WindowDots />
                  <div className="ml-1 flex h-6 flex-1 items-center gap-1.5 rounded-md bg-white/[0.04] px-2 text-[10.5px] text-slate-400 font-mono">
                    cofolio.app/p/{(state.profile.name || 'preview').replace(/\s/g, '-').toLowerCase()}
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 place-items-center text-white font-bold ring-grad">
                      {(state.profile.name || '?').slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold">{state.profile.name || '이름 없음'}</div>
                      <div className="text-[12px] text-slate-400">{state.profile.role || '직무 없음'}{state.profile.location && ` · ${state.profile.location}`}</div>
                      {state.profile.bio && <div className="text-[12px] text-slate-300 mt-0.5">{state.profile.bio}</div>}
                    </div>
                  </div>
                  {state.about.intro && (
                    <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 text-[12.5px] text-slate-300 leading-relaxed">{state.about.intro}</div>
                  )}
                  {allStack.length > 0 && (
                    <div>
                      <div className="text-[10.5px] uppercase tracking-[0.16em] text-slate-500 mb-1.5">Tech Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {allStack.map((t) => (
                          <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11.5px] font-mono text-slate-200">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {state.projects.length > 0 && (
                    <div>
                      <div className="text-[10.5px] uppercase tracking-[0.16em] text-slate-500 mb-1.5">Projects ({state.projects.length})</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {state.projects.map((p) => (
                          <div key={p.id} className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="text-[12.5px] font-semibold">{p.title || '제목 없음'}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{p.desc || '설명 없음'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-white/8 bg-ink-900/40 px-5 sm:px-7 py-3 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">템플릿: <span className="text-slate-300">{state.template}</span></div>
              <div className="flex gap-2">
                <button onClick={() => setPreviewOpen(false)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 h-9 text-[12px] text-slate-200 hover:bg-white/[0.08]">계속 편집</button>
                <PrimaryBtn size="sm" onClick={() => { setPreviewOpen(false); navigate('/generating') }}>
                  <Icon name="sparkles" size={13} /> 포트폴리오 생성
                </PrimaryBtn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── BuilderPage ───────────────────────────────────────────────────────────────
export default function BuilderPage() {
  const { state, update, fillExample, reset } = useBuilder()
  const navigate = useNavigate()
  const current = Math.max(0, Math.min(state.step || 0, STEPS.length - 1))

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    if (current === 0) {
      if (!state.profile.name?.trim()) e.name = '이름을 입력해주세요'
      if (!state.profile.role?.trim()) e.role = '직무를 입력해주세요'
    }
    return e
  }, [current, state])

  const next = () => {
    if (Object.keys(errors).length) return
    if (current < STEPS.length - 1) update({ step: current + 1 })
    else navigate('/generating')
  }

  const prev = () => {
    if (current > 0) update({ step: current - 1 })
    else navigate('/')
  }

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-60" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Icon name="logo-c" size={18} /></div>
            <span className="text-[15px] font-bold">Cofolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={fillExample} className="hidden sm:inline-flex items-center gap-1.5 text-[12px] text-slate-300 hover:text-white px-2.5 h-8 rounded-lg border border-white/10 bg-white/[0.03]">
              <Icon name="sparkles" size={12} /> 예시 채우기
            </button>
            <button onClick={reset} className="text-[12px] text-slate-500 hover:text-slate-300 px-2.5 h-8">초기화</button>
          </div>
        </div>
      </header>

      <Section className="py-10">
        <div className="mx-auto max-w-[860px]">
          <div className="reveal in"><StepBar current={current} /></div>

          <div className="mt-7 glass-strong ring-grad rounded-2xl p-6 sm:p-8 reveal in">
            {current === 0 && <StepProfile state={state} update={update} errors={errors} />}
            {current === 1 && <StepProjects state={state} update={update} errors={errors} />}
            {current === 2 && <StepStack state={state} update={update} />}
            {current === 3 && <StepFinalize state={state} update={update} />}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/8 pt-5">
              <GhostBtn onClick={prev}>{current === 0 ? '랜딩으로' : '이전'}</GhostBtn>
              <div className="text-[11.5px] text-slate-500">{current + 1} / {STEPS.length} 단계</div>
              <PrimaryBtn
                onClick={next}
                disabled={Object.keys(errors).length > 0}
                className={Object.keys(errors).length ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {current === STEPS.length - 1
                  ? <><>포트폴리오 생성하기</> <Icon name="sparkles" size={14} /></>
                  : <><>다음</> <Icon name="arrow" size={14} /></>}
              </PrimaryBtn>
            </div>
          </div>

          <div className="mt-4 text-center text-[11.5px] text-slate-500">입력한 내용은 자동으로 저장됩니다 · 언제든지 새로고침 가능</div>
        </div>
      </Section>
    </div>
  )
}
