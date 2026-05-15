import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, type DbPortfolio } from '../lib/supabase'
import type { BuilderState, PortfolioResult } from '../types'
import { PrimaryBtn } from '../components/common/Button'
import { Icon } from '../components/common/Icon'
import { Tag } from '../components/common/Tag'
import { WindowDots, ScoreRing } from '../components/common/Card'
import { FALLBACK_RESULT } from '../services/gemini'
import { cn } from '../utils/cn'

// ── Helpers ────────────────────────────────────────────────────────────────────
function scorePercentile(score: number): string {
  if (score >= 90) return '상위 5% — 최고예요!'
  if (score >= 80) return '상위 12% — 훌륭해요!'
  if (score >= 70) return '상위 25% — 좋아요!'
  if (score >= 60) return '상위 40% — 계속 발전 중!'
  return '아직 완성 중 — 더 채워봐요!'
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [portfolio, setPortfolio] = useState<DbPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return }

    const fetch = async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error || !data) {
        setNotFound(true)
      } else {
        setPortfolio(data as DbPortfolio)
        // Fire-and-forget view count increment
        supabase.rpc('increment_view_count', { portfolio_id: (data as DbPortfolio).id }).then(() => {})
      }
      setLoading(false)
    }

    fetch()
  }, [slug])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-violet-400 animate-spin" />
      </div>
    )
  }

  // ── 404 ───────────────────────────────────────────────────────────────────
  if (notFound || !portfolio) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center text-center px-5">
        <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-40" />
        <div className="text-[64px] font-bold text-white/10">404</div>
        <div className="text-[22px] font-bold tracking-tight mt-2">포트폴리오를 찾을 수 없어요</div>
        <div className="mt-2 text-[13.5px] text-slate-400">링크가 잘못됐거나 비공개 포트폴리오입니다.</div>
        <div className="mt-6 flex items-center gap-3">
          <PrimaryBtn onClick={() => navigate('/')}>홈으로 <Icon name="arrow" size={13} /></PrimaryBtn>
          <button onClick={() => navigate('/builder')} className="text-[13px] text-slate-400 hover:text-white">내 포트폴리오 만들기 →</button>
        </div>
      </div>
    )
  }

  // ── Render portfolio ───────────────────────────────────────────────────────
  const bs = (portfolio.builder_state || {}) as Partial<BuilderState>
  const pr = (portfolio.portfolio_result || {}) as Partial<PortfolioResult>

  const state: BuilderState = {
    step: 0,
    profile: bs.profile ?? { name: '', role: '', location: '', bio: '' },
    projects: bs.projects ?? [],
    stack: bs.stack ?? { frontend: [], backend: [], ai: [], database: [], deploy: [] },
    about: bs.about ?? { intro: '', career: '', goals: '' },
    template: bs.template ?? 'developer',
  }

  const r: PortfolioResult = {
    score: pr.score ?? FALLBACK_RESULT.score,
    scoreBreakdown: pr.scoreBreakdown?.length ? pr.scoreBreakdown : [],
    enhancedDescriptions: pr.enhancedDescriptions ?? {},
    interviewQuestions: pr.interviewQuestions ?? [],
    suggestions: pr.suggestions ?? [],
    bioImproved: pr.bioImproved ?? '',
  }

  const profile = state.profile
  const projects = state.projects
  const allStack = Object.values(state.stack).flat()
  const shareUrl = `cofolio.app/p/${slug}`

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-40" />

      {/* ── Public header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Icon name="logo-c" size={18} /></div>
            <span className="text-[15px] font-bold">Cofolio</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[12px] text-slate-400">Cofolio로 만든 포트폴리오</span>
            <PrimaryBtn size="sm" onClick={() => navigate('/builder')}>
              나도 만들기 <Icon name="arrow" size={13} />
            </PrimaryBtn>
          </div>
        </div>
      </header>

      {/* ── Portfolio content ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1180px] px-5 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-5">
          {/* ── Portfolio preview ──────────────────────────────────────── */}
          <div className="glass-strong rounded-2xl overflow-hidden ring-grad glow-violet">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/60">
              <WindowDots />
              <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
                <Icon name="globe" size={11} /><span className="font-mono">{shareUrl}</span>
              </div>
            </div>
            <div className="p-6">
              {/* Profile */}
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
                      {profile.role && <Tag tone="violet">{profile.role}</Tag>}
                    </div>
                    <div className="text-[12px] text-slate-400 mt-0.5">
                      {r.bioImproved || [profile.location, profile.bio].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {([
                  ['Projects', projects.length, 'violet'],
                  ['Tech Stacks', allStack.length || 0, 'indigo'],
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

              {/* Projects */}
              {projects.length > 0 && (
                <>
                  <div className="mt-5 text-[13px] font-semibold text-slate-200">대표 프로젝트</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projects.slice(0, 4).map((p, i) => (
                      <div key={p.id} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                        <div className={cn('h-12 stripes bg-gradient-to-br', i % 2 ? 'from-cyan-500/40 to-blue-500/20' : 'from-violet-500/40 to-indigo-500/20')} />
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-[13px] font-semibold">{p.title}</div>
                            {p.role && <Tag tone="cyan">{p.role}</Tag>}
                          </div>
                          <div className="mt-1 text-[12px] text-slate-400 leading-relaxed line-clamp-2">
                            {r.enhancedDescriptions[p.id] || p.desc}
                          </div>
                          {(p.github || p.deploy) && (
                            <div className="mt-2 flex gap-2">
                              {p.github && (
                                <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10.5px] text-slate-400 hover:text-white">
                                  <Icon name="github" size={11} /> GitHub
                                </a>
                              )}
                              {p.deploy && (
                                <a href={p.deploy.startsWith('http') ? p.deploy : `https://${p.deploy}`} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10.5px] text-cyan-300 hover:text-cyan-100">
                                  <Icon name="rocket" size={11} /> 배포
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tech stack */}
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

          {/* ── Score sidebar ──────────────────────────────────────────── */}
          <div className="space-y-5">
            {r.score > 0 && (
              <div className="glass rounded-2xl p-5 text-center">
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
            )}

            {/* About */}
            {(state.about.intro || state.about.career || state.about.goals) && (
              <div className="glass rounded-2xl p-5">
                <div className="text-[13px] font-semibold text-slate-200 mb-3">소개</div>
                <div className="space-y-3">
                  {state.about.intro && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-1">자기소개</div>
                      <div className="text-[12.5px] text-slate-300 leading-relaxed">{state.about.intro}</div>
                    </div>
                  )}
                  {state.about.career && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-1">경력·활동</div>
                      <div className="text-[12.5px] text-slate-300 leading-relaxed">{state.about.career}</div>
                    </div>
                  )}
                  {state.about.goals && (
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 mb-1">목표</div>
                      <div className="text-[12.5px] text-slate-300 leading-relaxed">{state.about.goals}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass rounded-2xl p-5 text-center">
              <div className="text-[13px] font-semibold text-white mb-1">나만의 포트폴리오 만들기</div>
              <div className="text-[12px] text-slate-400 mb-4">AI가 포트폴리오를 분석하고 면접 질문까지 준비해줘요.</div>
              <PrimaryBtn size="lg" className="w-full" onClick={() => navigate('/builder')}>
                무료로 시작하기 <Icon name="arrow" size={14} />
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
