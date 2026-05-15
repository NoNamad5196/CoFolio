import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBuilder } from '../context/BuilderContext'
import { useAuth } from '../context/AuthContext'
import { supabase, type DbPortfolio } from '../lib/supabase'
import { FALLBACK_RESULT } from '../services/gemini'
import { Section } from '../components/common/Section'
import { PrimaryBtn, GhostBtn } from '../components/common/Button'
import { Icon } from '../components/common/Icon'
import { Tag } from '../components/common/Tag'
import { ExportModal } from '../components/modals/ExportModal'
import { cn } from '../utils/cn'

const FALLBACK_PROJECTS = [
  { id: 1, title: 'Notewave', desc: '실시간 협업 노트', role: 'Frontend Lead', github: '', deploy: '' },
  { id: 2, title: 'Mealy', desc: 'AI 식단 추천', role: 'Full-stack', github: '', deploy: '' },
  { id: 3, title: 'DesignKit', desc: '디자인 시스템 라이브러리', role: 'Maintainer', github: '', deploy: '' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state, result, loadFromSupabase } = useBuilder()
  const { user, profile } = useAuth()

  const [exportOpen, setExportOpen] = useState(false)
  const [dbPortfolio, setDbPortfolio] = useState<DbPortfolio | null>(null)
  const [isPublished, setIsPublished] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)

  const r = result ?? FALLBACK_RESULT
  const projects = state.projects?.length ? state.projects : FALLBACK_PROJECTS
  const stackCount = Object.values(state.stack || {}).flat().length || 12
  const profileSlug = dbPortfolio?.slug || (state.profile?.name || 'user').toLowerCase().replace(/\s+/g, '-')
  const greeting = profile?.display_name || state.profile?.name || '사용자'

  // ── Fetch portfolio from DB ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      const { data } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setDbPortfolio(data as DbPortfolio)
        setIsPublished((data as DbPortfolio).is_published)
        await loadFromSupabase()
      }
    }

    fetch()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Publish toggle ───────────────────────────────────────────────────────
  const togglePublish = async () => {
    if (!dbPortfolio?.id) return
    setToggleLoading(true)
    const newVal = !isPublished
    const { error } = await supabase
      .from('portfolios')
      .update({ is_published: newVal })
      .eq('id', dbPortfolio.id)
    if (!error) setIsPublished(newVal)
    setToggleLoading(false)
  }

  const kpis = [
    { l: 'Portfolio Score', v: String(r.score), c: 'violet', icon: 'sparkles' as const },
    { l: 'Projects', v: String(projects.length), c: 'indigo', icon: 'folder' as const },
    { l: 'Tech Stacks', v: String(stackCount), c: 'cyan', icon: 'layers' as const },
    { l: '방문자 수', v: dbPortfolio ? String(dbPortfolio.view_count) : '—', c: 'emerald', icon: 'eye' as const },
  ]

  const nextSteps = [
    {
      l: '포트폴리오 링크 공유하기',
      a: '링크 복사',
      action: () => { navigator.clipboard?.writeText(`https://cofolio.app/p/${profileSlug}`).catch(() => {}) },
    },
    { l: 'README로 내보내기', a: '내보내기', action: () => setExportOpen(true) },
    { l: '면접 질문 8개 검토', a: '보기', action: () => navigate('/result') },
    { l: '커스텀 도메인 연결', a: 'Pro 업그레이드', action: null as (() => void) | null },
  ]

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-40" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Icon name="logo-c" size={18} /></div>
            <span className="text-[15px] font-bold">Cofolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <GhostBtn size="sm" onClick={() => navigate('/result')}><Icon name="eye" size={13} /> 미리보기</GhostBtn>
            <GhostBtn size="sm" onClick={() => setExportOpen(true)}><Icon name="download" size={13} /> 내보내기</GhostBtn>
            <PrimaryBtn size="sm" onClick={() => navigate('/builder')}><Icon name="plus" size={13} /> 새 프로젝트</PrimaryBtn>
          </div>
        </div>
      </header>

      <Section className="py-10">
        {/* ── Header row ───────────────────────────────────────────────── */}
        <div className="reveal in flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-[12px] text-slate-500">안녕하세요, {greeting}님 👋</div>
            <h1 className="mt-1 text-[28px] sm:text-[32px] font-bold tracking-tight">내 포트폴리오 대시보드</h1>
          </div>

          {/* Publish badge + toggle */}
          <div className="flex items-center gap-2">
            <div className={cn(
              'hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px]',
              isPublished
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-400/20 bg-slate-500/10 text-slate-400',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', isPublished ? 'bg-emerald-400 anim-pulse' : 'bg-slate-500')} />
              {isPublished ? `공개됨 · cofolio.app/p/${profileSlug}` : '비공개'}
            </div>
            {dbPortfolio && (
              <button
                onClick={togglePublish}
                disabled={toggleLoading}
                className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-slate-200 hover:bg-white/[0.08] disabled:opacity-50"
              >
                {toggleLoading
                  ? <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : isPublished ? '비공개로' : '공개하기'}
              </button>
            )}
          </div>
        </div>

        {/* ── KPI cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {kpis.map((k) => (
            <div key={k.l} className="reveal in glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{k.l}</div>
                <Icon name={k.icon} size={13} className="text-slate-500" />
              </div>
              <div className={cn('mt-2 text-[28px] font-bold tracking-tight',
                k.c === 'violet' ? 'text-violet-300' : k.c === 'indigo' ? 'text-indigo-300' : k.c === 'cyan' ? 'text-cyan-300' : 'text-emerald-300'
              )}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* ── Main grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-5">
          {/* Project list */}
          <div className="reveal in glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-semibold">프로젝트 목록</div>
              <button onClick={() => navigate('/builder')} className="inline-flex items-center gap-1.5 text-[12px] text-violet-200 hover:text-violet-100">
                <Icon name="plus" size={12} /> 추가
              </button>
            </div>
            <div className="space-y-2">
              {projects.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04]">
                  <div className={cn(
                    'h-9 w-9 rounded-lg grid place-items-center text-[12px] font-bold border border-white/10',
                    i % 3 === 0 ? 'bg-violet-500/20 text-violet-200' : i % 3 === 1 ? 'bg-cyan-500/20 text-cyan-200' : 'bg-indigo-500/20 text-indigo-200'
                  )}>
                    {(p.title || 'P').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{p.title || '프로젝트'}</div>
                    <div className="text-[11.5px] text-slate-400 truncate">{p.desc || '설명'}</div>
                  </div>
                  <Tag tone={isPublished ? 'emerald' : 'slate'}>{isPublished ? '공개' : '비공개'}</Tag>
                  <button onClick={() => navigate('/builder')} className="text-[11.5px] text-slate-400 hover:text-white">편집</button>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="reveal in glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20">
                <Icon name="sparkles" size={13} />
              </span>
              <div className="text-[14px] font-semibold">다음 단계</div>
            </div>
            <div className="space-y-2">
              {nextSteps.map((it, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 flex items-center justify-between gap-3">
                  <div className="text-[12.5px] text-slate-200">{it.l}</div>
                  <button
                    onClick={it.action || (() => {})}
                    disabled={!it.action}
                    className="text-[11.5px] text-violet-200 hover:text-violet-100 disabled:text-slate-600 disabled:cursor-default"
                  >
                    {it.a} {it.action ? '→' : ''}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} portfolioName={state.profile?.name || 'portfolio'} />
    </div>
  )
}
