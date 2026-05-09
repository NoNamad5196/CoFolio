import { useNavigate } from 'react-router-dom'
import { Section, SectionHeading } from '../common/Section'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { PrimaryBtn, GhostBtn } from '../common/Button'
import { PRICING_PLANS } from '../../data/pricing'
import { cn } from '../../utils/cn'

export function PricingSection() {
  const navigate = useNavigate()

  return (
    <Section id="pricing" className="py-24">
      <SectionHeading
        eyebrow="PRICING"
        title={<>필요한 만큼 시작하고, <span className="text-grad">성장에 맞게 확장하세요.</span></>}
        sub="언제든지 업그레이드하거나 다운그레이드할 수 있습니다."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {PRICING_PLANS.map((p, i) => (
          <div
            key={p.name}
            className={cn(
              'reveal relative rounded-2xl p-7 lift',
              p.recommended ? 'glass-strong ring-grad glow-violet' : 'glass'
            )}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {p.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                <Icon name="star" size={11} /> 추천
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-bold tracking-tight">{p.name}</div>
              <Tag tone={p.tone}>{p.tagLabel}</Tag>
            </div>
            <div className="mt-1 text-[12.5px] text-slate-400">{p.desc}</div>
            <div className="mt-5 flex items-baseline gap-1">
              <div className={cn('text-[36px] font-bold tracking-tight', p.recommended ? 'text-grad' : 'text-white')}>{p.price}</div>
              <div className="text-[13px] text-slate-500">{p.per}</div>
            </div>
            {p.recommended
              ? <PrimaryBtn className="mt-5 w-full" size="lg" onClick={() => navigate('/builder')}>{p.cta}</PrimaryBtn>
              : <GhostBtn className="mt-5 w-full" size="lg" onClick={() => navigate('/builder')}>{p.cta}</GhostBtn>}
            <div className="mt-6 h-px bg-white/8" />
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-200">
                  <span className={cn(
                    'mt-0.5 grid h-4 w-4 place-items-center rounded-full',
                    p.recommended ? 'bg-violet-500/25 text-violet-200' : 'bg-white/8 text-slate-300'
                  )}>
                    <Icon name="check" size={11} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-[12px] text-slate-500">모든 플랜은 부가세 별도이며, 학생 인증 시 50% 할인 제공합니다.</div>
    </Section>
  )
}
