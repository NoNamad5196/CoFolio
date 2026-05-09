import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { PrimaryBtn } from '../common/Button'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { WindowDots } from '../common/Card'
import type { ShowcaseItem } from '../../data/showcasePortfolios'

interface Props {
  portfolio: ShowcaseItem | null
  onClose: () => void
}

export function PortfolioPreviewModal({ portfolio, onClose }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!portfolio) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [portfolio, onClose])

  if (!portfolio) return null
  const p = portfolio

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.title} 미리보기`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      style={{ animation: 'fadeIn .2s ease-out' }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-[960px] max-h-[92vh] overflow-hidden rounded-2xl glass-strong ring-grad glow-violet flex flex-col"
        style={{ animation: 'popIn .28s cubic-bezier(.2,.7,.2,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 sm:px-7 py-4 bg-ink-900/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag tone="violet">{p.role}</Tag>
              <Tag tone="cyan">{p.themeLabel}</Tag>
            </div>
            <div className="mt-2 text-[18px] sm:text-[20px] font-bold tracking-tight truncate">{p.title}</div>
            <div className="mt-1 text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">{p.description}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="모달 닫기"
            className="shrink-0 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto nosb p-5 sm:p-7 space-y-5">
          {/* Browser preview */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/50 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/70">
              <WindowDots />
              <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
                <Icon name="globe" size={11} />
                <span className="font-mono truncate">cofolio.app/p/{p.id}</span>
              </div>
            </div>
            <div className={cn('relative px-5 sm:px-6 pt-5 pb-6 bg-gradient-to-br', p.thumb)}>
              <div className="absolute inset-0 bg-grid opacity-25" />
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 place-items-center text-white font-bold text-[15px] ring-grad">
                    {p.profile.initials}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">{p.profile.name}</div>
                    <div className="text-[11.5px] text-slate-300/90">{p.profile.bio}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/[0.1]">
                    <Icon name="github" size={13} /> GitHub
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-[12px] text-cyan-100 hover:bg-cyan-500/25">
                    <Icon name="rocket" size={13} /> 배포 보기
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-t border-white/5">
              {p.previewStats.map((s) => (
                <div key={s.l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{s.l}</div>
                  <div className={cn(
                    'mt-1 text-[20px] font-bold',
                    s.c === 'violet' ? 'text-violet-300' :
                    s.c === 'indigo' ? 'text-indigo-300' :
                    s.c === 'cyan' ? 'text-cyan-300' : 'text-emerald-300'
                  )}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="rounded-2xl glass p-5">
            <div className="text-[13px] font-semibold mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {p.techStack.map((tech) => (
                <span key={tech} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[12px] font-mono text-slate-200">{tech}</span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold">대표 프로젝트</div>
              <div className="text-[11px] text-slate-500">{p.projects.length}개</div>
            </div>
            <div className="space-y-3">
              {p.projects.map((proj) => (
                <div key={proj.t} className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.02]">
                  <div className={cn('h-12 bg-gradient-to-br stripes', proj.col)} />
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[14px] font-semibold">{proj.t}</div>
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.map((tag) => (
                            <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[12px] text-slate-400 mt-1 leading-relaxed">{proj.d}</div>
                    </div>

                    {(proj.myRole || proj.problem || proj.solution || proj.result || proj.learned) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px]">
                        {proj.myRole && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-violet-300/80">본인 역할</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.myRole}</div>
                          </div>
                        )}
                        {proj.problem && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-cyan-300/80">문제 상황</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.problem}</div>
                          </div>
                        )}
                        {proj.solution && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5 sm:col-span-2">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-indigo-300/80">해결 방법</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.solution}</div>
                          </div>
                        )}
                        {proj.result && (
                          <div className="rounded-lg border border-emerald-400/15 bg-emerald-500/[0.04] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">결과</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.result}</div>
                          </div>
                        )}
                        {proj.learned && (
                          <div className="rounded-lg border border-pink-400/15 bg-pink-500/[0.04] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-pink-300/80">배운 점</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.learned}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {(proj.github || proj.deploy) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {proj.github && (
                          <a
                            href={`https://${proj.github}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] text-slate-200 hover:bg-white/[0.08]"
                          >
                            <Icon name="github" size={12} /> GitHub
                          </a>
                        )}
                        {proj.deploy && (
                          <a
                            href={`https://${proj.deploy}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1.5 text-[11.5px] text-cyan-100 hover:bg-cyan-500/20"
                          >
                            <Icon name="rocket" size={12} /> 배포
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 bg-ink-900/50 px-5 sm:px-7 py-3 flex items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500">미리보기는 Cofolio가 생성하는 결과물 예시입니다.</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">닫기</button>
            <PrimaryBtn size="sm" onClick={() => { onClose(); navigate('/builder') }}>
              <Icon name="sparkles" size={13} /> 비슷하게 만들기
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  )
}
