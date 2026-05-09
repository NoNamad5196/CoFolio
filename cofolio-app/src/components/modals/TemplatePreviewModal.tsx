import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { PrimaryBtn } from '../common/Button'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { WindowDots } from '../common/Card'
import { TEMPLATE_PREVIEWS } from '../../data/templates'
import type { TemplateType } from '../../types'

interface Props {
  isOpen: boolean
  templateId: TemplateType | null
  onClose: () => void
  onSelect?: (t: TemplateType) => void
}

export function TemplatePreviewModal({ isOpen, templateId, onClose, onSelect }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [isOpen, onClose])

  if (!isOpen || !templateId) return null
  const t = TEMPLATE_PREVIEWS[templateId]
  if (!t) return null

  const displayName = templateId === 'developer' ? 'Developer' : templateId === 'designer' ? 'Designer' : 'Student'

  const handleStart = () => {
    onSelect?.(templateId)
    onClose()
    navigate('/builder')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" style={{ animation: 'fadeIn .2s ease' }}>
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-[1080px] max-h-[92vh] glass-strong rounded-2xl ring-grad overflow-hidden flex flex-col"
        style={{ animation: 'popIn .3s cubic-bezier(.2,.8,.2,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-3 bg-ink-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <WindowDots />
            <div className="ml-2 flex items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-slate-400 font-mono">
              <Icon name="globe" size={11} /> cofolio.app/templates/{templateId}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag tone={t.tone}>{displayName} 템플릿</Tag>
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 hover:bg-white/[0.08]">
              <Icon name="x" size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable preview */}
        <div className="flex-1 overflow-y-auto nosb">
          {/* Hero */}
          <div className="relative px-7 py-10 border-b border-white/5">
            <div aria-hidden className={cn('absolute inset-0 bg-gradient-to-br opacity-20', t.accent)} />
            <div aria-hidden className="absolute inset-0 bg-grid opacity-25" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className={cn('grid h-16 w-16 rounded-2xl bg-gradient-to-br place-items-center text-white font-bold text-xl ring-grad', t.accent)}>
                  {t.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[22px] font-bold tracking-tight">{t.name}</div>
                    <Tag tone={t.tone}>{t.role}</Tag>
                  </div>
                  <div className="mt-1 text-[13px] text-slate-400">{t.location} · {t.bio}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-200">
                  <Icon name="github" size={13} /> GitHub
                </div>
                <div className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px]',
                  t.tone === 'cyan' ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100' :
                  t.tone === 'indigo' ? 'border-indigo-400/30 bg-indigo-500/10 text-indigo-100' :
                  'border-violet-400/30 bg-violet-500/10 text-violet-100'
                )}>
                  <Icon name="rocket" size={13} /> Live
                </div>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              {t.stats.map(([l, v, c]) => (
                <div key={l} className="rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
                  <div className={cn('mt-1 text-[24px] font-bold', c === 'violet' ? 'text-violet-300' : c === 'indigo' ? 'text-indigo-300' : 'text-cyan-300')}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sections nav */}
          <div className="px-7 py-3 border-b border-white/5 bg-ink-900/40 sticky top-0 z-10 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
              {t.sections.map((s, i) => (
                <span key={s} className={cn(
                  'rounded-full px-2.5 py-1 border',
                  i === 0 ? 'border-violet-400/40 bg-violet-500/15 text-violet-100' : 'border-white/8 bg-white/[0.03] text-slate-400'
                )}>{s}</span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="px-7 py-7">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-semibold">
                {templateId === 'designer' ? 'Selected Works' : templateId === 'student' ? 'Projects & Activities' : 'Featured Projects'}
              </div>
              <div className="text-[11.5px] text-slate-500">{t.projects.length} items</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.projects.map((p) => (
                <div key={p.t} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <div className={cn('h-20 stripes bg-gradient-to-br', p.col)} />
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13.5px] font-semibold truncate">{p.t}</div>
                      <Icon name="link" size={12} className="text-slate-500 shrink-0" />
                    </div>
                    <div className="mt-1 text-[12px] text-slate-400 leading-relaxed">{p.d}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((tg) => (
                        <span key={tg} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10.5px] text-slate-300 font-mono">{tg}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="px-7 py-6 border-t border-white/5">
            <div className="text-[15px] font-semibold mb-3">{templateId === 'designer' ? 'Tools' : 'Tech Stack'}</div>
            <div className="flex flex-wrap gap-1.5">
              {t.stack.map((s) => (
                <span key={s} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] font-mono text-slate-200">{s}</span>
              ))}
            </div>
          </div>

          {/* Student timeline */}
          {templateId === 'student' && t.timeline && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">Activities & Awards</div>
              <div className="space-y-2">
                {t.timeline.map((it, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                    <div className="mt-0.5 grid h-7 w-12 place-items-center rounded-md bg-indigo-500/15 text-indigo-200 border border-indigo-400/20 font-mono text-[11px]">{it.y}</div>
                    <div className="text-[13px] text-slate-200">{it.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Designer mood */}
          {templateId === 'designer' && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">Mood / Direction</div>
              <div className="grid grid-cols-4 gap-2">
                {['from-fuchsia-500/60 to-violet-500/30', 'from-cyan-500/60 to-blue-500/30', 'from-amber-400/60 to-rose-500/30', 'from-emerald-400/60 to-teal-500/30'].map((c, i) => (
                  <div key={i} className={cn('h-20 rounded-xl bg-gradient-to-br', c)} />
                ))}
              </div>
            </div>
          )}

          {/* Developer GitHub activity */}
          {templateId === 'developer' && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">GitHub Activity</div>
              <div className="grid grid-cols-[repeat(20,1fr)] gap-1">
                {Array.from({ length: 100 }).map((_, i) => {
                  const intensity = ((i * 37 + 13) % 100) / 100
                  const c = intensity > 0.85 ? 'bg-violet-400/80' : intensity > 0.6 ? 'bg-violet-400/50' : intensity > 0.35 ? 'bg-violet-400/25' : 'bg-white/5'
                  return <div key={i} className={cn('h-3 rounded-sm', c)} />
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 bg-ink-900/50 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11.5px] text-slate-500">이 템플릿으로 시작하면 위 구조가 자동으로 적용됩니다.</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">닫기</button>
            <PrimaryBtn size="sm" onClick={handleStart}>
              <Icon name="sparkles" size={13} /> 이 템플릿으로 시작
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
