import { useState } from 'react'
import { Section, SectionHeading } from '../common/Section'
import { Icon } from '../common/Icon'
import { PortfolioPreviewModal } from '../modals/PortfolioPreviewModal'
import { SHOWCASE_ITEMS, type ShowcaseItem } from '../../data/showcasePortfolios'
import { cn } from '../../utils/cn'

export function ShowcaseSection() {
  const [selected, setSelected] = useState<ShowcaseItem | null>(null)

  return (
    <Section id="showcase" className="py-24">
      <SectionHeading
        eyebrow="SHOWCASE"
        title={<>완성된 포트폴리오는 <span className="text-grad">이렇게 보입니다.</span></>}
        sub="Cofolio가 만들어낸 결과물 예시입니다."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHOWCASE_ITEMS.map((it, i) => (
          <div
            key={it.title}
            className="reveal group glass lift rounded-2xl overflow-hidden"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="relative h-48 overflow-hidden border-b border-white/8">
              <div className={cn('absolute inset-0 bg-gradient-to-br', it.thumb)} />
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-3 rounded-lg bg-ink-900/70 backdrop-blur p-3 transition-transform duration-500 group-hover:scale-[1.04]">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="mt-2 h-2.5 w-2/3 rounded bg-white/15" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/8" />
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {Array.from({ length: it.lines }).map((_, k) => (
                    <div key={k} className="h-7 rounded bg-white/8" />
                  ))}
                </div>
                <div className="mt-2 flex gap-1">
                  <div className="h-1.5 w-6 rounded bg-violet-400/60" />
                  <div className="h-1.5 w-4 rounded bg-cyan-400/60" />
                  <div className="h-1.5 w-8 rounded bg-indigo-400/60" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[14.5px] font-semibold tracking-tight">{it.title}</div>
              <div className="mt-0.5 text-[11.5px] text-violet-300/80">{it.role}</div>
              <div className="mt-2 text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">{it.d}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {it.tags.map((t) => (
                  <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10.5px] font-mono text-slate-300">{t}</span>
                ))}
              </div>
              <button
                onClick={() => setSelected(it)}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-violet-200 hover:text-violet-100"
              >
                포트폴리오 보기 <Icon name="arrow" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <PortfolioPreviewModal portfolio={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
