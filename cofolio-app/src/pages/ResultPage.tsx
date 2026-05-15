import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBuilder } from '../context/BuilderContext'
import { useAuth } from '../context/AuthContext'
import { Section, Eyebrow } from '../components/common/Section'
import { PrimaryBtn, GhostBtn } from '../components/common/Button'
import { Icon } from '../components/common/Icon'
import { Tag } from '../components/common/Tag'
import { WindowDots, ScoreRing } from '../components/common/Card'
import { ExportModal } from '../components/modals/ExportModal'
import { FALLBACK_RESULT } from '../services/gemini'
import { cn } from '../utils/cn'

const FALLBACK_PROJECTS = [
  { id: 1, title: 'Notewave', desc: '실시간 협업 노트', role: 'Frontend Lead', github: 'github.com/u/notewave', deploy: 'notewave.app' },
  { id: 2, title: 'Mealy', desc: 'AI 식단 추천', role: 'Full-stack', github: 'github.com/u/mealy', deploy: 'mealy.app' },
]

const FALLBACK_PROFILE = { name: '김근호', role: 'Frontend Developer', location: '서울', bio: '사용자 경험을 코드로 다듬는 3년차 프론트엔드' }

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function scorePercentile(score: number): string {
  if (score >= 90) return '상위 5% — 최고예요!'
  if (score >= 80) return '상위 12% — 훌륭해요!'
  if (score >= 70) return '상위 25% — 좋아요!'
  if (score >= 60) return '상위 40% — 계속 발전 중!'
  return '아직 완성 중 — 더 채워봐요!'
}

export default function ResultPage() {
  const { state, result, saveToSupabase, savedSlug } = useBuilder()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [exportOpen, setExportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const hasSaved = useRef(false)

  const r = result ?? FALLBACK_RESULT
  const projects = state.projects?.length ? state.projects : FALLBACK_PROJECTS
  const allStack = Object.values(state.stack || {}).flat()
  const profile = state.profile?.name ? state.profile : FALLBACK_PROFILE

  // Build share URL: use saved DB slug when available, else derive from name
  const shareUrl = savedSlug
    ? `cofolio.app/p/${savedSlug}`
    : `cofolio.app/p/${(profile.name || 'you').toLowerCase().replace(/\s+/g, '-')}`

  // ── Auto-save when user is present ──────────────────────────────────────────
  useEffect(() => {
    if (!user || hasSaved.current) return
    hasSaved.current = true
    setSaveStatus('saving')

    saveToSupabase().then((slug) => {
      if (slug) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    })
  }, [user, saveToSupabase])

  const copy = () => {
    navigator.clipboard?.writeText('https://' + shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-50" />

      {/* ── Save status toast ─────────────────────────────────────────────── */}
      {saveStatus !== 'idle' && (
        <div className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-medium shadow-lg',
          saveStatus === 'saving' && 'border border-white/10 bg-ink-900/90 text-slate-300',
          saveStatus === 'saved' && 'border border-emerald-400/30 bg-emerald-900/80 text-emerald-200',
          saveStatus === 'error' && 'border border-red-400/30 bg-red-900/80 text-red-200',
        )}>
          {saveStatus === 'saving' && <><span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> 저장 중…</>}
          {saveStatus === 'saved' && <><Icon name="check" size={13} /> 포트폴리오가 저장됐어요 ✓</>}
          {saveStatus === 'error' && '저장 실패 — 나중에 다시 시도해주세요'}
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Icon name="logo-c" size={18} /></div>
            <span className="text-[15px] font-bold">Cofolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <GhostBtn size="sm" onClick={copy}><Icon name="globe" size={13} /> {copied ? '복사됨!' : '공개 링크'}</GhostBtn>
            <GhostBtn size="sm" onClick={() => navigate('/builder')}><Icon name="wand" size={13} /> 수정하기</GhostBtn>
            <GhostBtn size="sm" onClick={() => setExportOpen(true)}><Icon name="download" size={13} /> 내보내기</GhostBtn>
            <PrimaryBtn size="sm" onClick={() => navigate('/dashboard')}><Icon name="rocket" size={13} /> 대시보드로</PrimaryBtn>
          </div>
        </div>
      </header>

      <Section className="py-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal in flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <Eyebrow>READY!</Eyebrow>
              <h1 className="mt-3 text-[32px] sm:text-[40px] font-bold tracking-tight">포트폴리오가 <span className="text-grad">완성됐어요</span></h1>
              <p className="mt-2 text-[13.5px] text-slate-400">아래 미리보기를 확인하고 공개하거나 README로 내보낼 수 있습니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 h-10 font-mono text-[12px] text-slate-400">
                <Icon name="globe" size={12} /> {shareUrl}
              </div>
              <button onClick={copy} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 h-10 text-[12.5px] text-slate-200 hover:bg-white/[0.06]">
                {copied ? '복사됨!' : '링크 복사'}
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-5">
            {/* ── portfolio preview ─────────────────────────────────────── */}
            <div className="reveal in glass-strong rounded-2xl overflow-hidden ring-grad glow-violet">
              <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/60">
                <WindowDots />
                <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
                  <Icon name="globe" size={11} /><span className="font-mono">{shareUrl}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 place-items-center text-white ring-grad">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[18px] font-semibold">{profile.name || '이름'}</div>
                        <Tag tone="violet">{profile.role || 'Developer'}</Tag>
                      </div>
                      <div className="text-[12px] text-slate-400 mt-0.5">
                        {r.bioImproved || [profile.location, profile.bio].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-200"><Icon name="github" size={13} /> GitHub</div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[12px] text-cyan-100"><Icon name="rocket" size={13} /> Deploy</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {([
                    ['Projects', projects.length, 'violet'],
                    ['Tech Stacks', allStack.length || 12, 'indigo'],
                    ['Score', r.score, 'cyan'],
                  ] as const).map(([l, v, c]) => (
                    <div key={l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
                      <div className={cn('mt-1 text-2xl font-bold',
                        c === 'violet' ? 'text-violet-300' : c === 'indigo' ? 'text-indigo-300' : 'text-cyan-300'
                      )}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-[13px] font-semibold text-slate-200">대표 프로젝트</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.slice(0, 4).map((p, i) => (
                    <div key={p.id} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                      <div className={cn('h-12 stripes bg-gradient-to-br', i % 2 ? 'from-cyan-500/40 to-blue-500/20' : 'from-violet-500/40 to-indigo-500/20')} />
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[13px] font-semibold">{p.title || `Project ${i + 1}`}</div>
                          {p.role && <Tag tone="cyan">{p.role}</Tag>}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-400 leading-relaxed line-clamp-2">
                          {r.enhancedDescriptions[p.id] || p.desc || '프로젝트 설명'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {allStack.length > 0 && (
                  <>
                    <div className="mt-5 text-[13px] font-semibold text-slate-200">Tech Stack</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {allStack.map((t) => (
                        <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] font-mono text-slate-200">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── sidebar ───────────────────────────────────────────────── */}
            <div className="space-y-5">
              <div className="reveal in glass rounded-2xl p-5 text-center">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Portfolio Score</div>
                <div className="mt-3 grid place-items-center"><ScoreRing value={r.score} size={160} /></div>
                <div className="mt-3 text-[12px] text-emerald-300">{scorePercentile(r.score)}</div>
                {r.scoreBreakdown.length > 0 && (
                  <div className="mt-4 space-y-2 text-left">
                    {r.scoreBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className="text-[11px] text-slate-400 w-16 shrink-0">{item.label}</div>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: `${item.value}%` }} />
                        </div>
                        <div className="text-[11px] font-mono text-slate-300 w-7 text-right">{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="reveal in glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20">
                    <Icon name="sparkles" size={13} />
                  </span>
                  <div className="text-[13px] font-semibold">AI 개선 제안</div>
                </div>
                <div className="space-y-2 text-[12.5px]">
                  {r.suggestions.map((s, i) => (
                    <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-slate-300 leading-relaxed">{s}</div>
                  ))}
                </div>
              </div>

              {r.interviewQuestions.length > 0 && (
                <div className="reveal in glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/15 text-cyan-200 border border-cyan-400/20">
                      <Icon name="sparkles" size={13} />
                    </span>
                    <div className="text-[13px] font-semibold">예상 면접 질문</div>
                  </div>
                  <div className="space-y-2">
                    {r.interviewQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-[12px] text-slate-300 leading-relaxed">
                        <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-500/15 text-cyan-300 font-mono text-[10px]">{i + 1}</span>
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="reveal in flex flex-col gap-2">
                <PrimaryBtn size="lg" onClick={() => navigate('/dashboard')}><Icon name="rocket" size={14} /> 공개하고 대시보드로</PrimaryBtn>
                <GhostBtn onClick={() => navigate('/builder')}><Icon name="wand" size={14} /> 다시 수정하기</GhostBtn>
                <button onClick={() => navigate('/')} className="text-[12px] text-slate-500 hover:text-slate-300 mt-1">처음으로 돌아가기</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Non-auth sticky banner ─────────────────────────────────────────── */}
      {!user && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-violet-500/20 bg-ink-950/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
            <div>
              <div className="text-[13px] font-semibold text-white">포트폴리오를 저장하고 싶으신가요?</div>
              <div className="text-[11.5px] text-slate-400 mt-0.5">로그인하면 공개 링크를 받고 방문자 수를 확인할 수 있어요.</div>
            </div>
            <PrimaryBtn size="sm" onClick={() => navigate('/login', { state: { from: { pathname: '/result' } } })}>
              <Icon name="arrow" size={13} /> 로그인하여 저장하기
            </PrimaryBtn>
          </div>
        </div>
      )}

      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} portfolioName={profile.name || 'portfolio'} />
    </div>
  )
}
