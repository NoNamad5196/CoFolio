import { useState } from 'react'
import { Section, SectionHeading } from '../common/Section'
import { Icon } from '../common/Icon'
import { FAQ_ITEMS } from '../../data/pricing'
import { cn } from '../../utils/cn'

export function FAQSection() {
  const [open, setOpen] = useState(0)

  return (
    <Section id="faq" className="py-24">
      <SectionHeading
        eyebrow="FAQ"
        title={<><span className="text-grad">자주 묻는 질문</span></>}
        sub="더 궁금한 점이 있다면 hello@cofolio.app 으로 문의해주세요."
      />
      <div className="mt-12 mx-auto max-w-3xl reveal">
        <div className="glass rounded-2xl divide-y divide-white/5 overflow-hidden">
          {FAQ_ITEMS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <button
                key={q}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full text-left px-5 sm:px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02]"
              >
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-200 border border-violet-400/20 font-mono text-[11px]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 text-[15px] font-semibold text-slate-100">{q}</div>
                    <Icon
                      name="chevron-down"
                      size={16}
                      className={cn('mt-1 text-slate-400 transition', isOpen && 'rotate-180 text-violet-300')}
                    />
                  </div>
                  <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0')}>
                    <div className="overflow-hidden">
                      <div className="text-[13.5px] text-slate-400 leading-[1.7] pr-2">{a}</div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
