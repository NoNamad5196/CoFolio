import { Section, SectionHeading } from '../common/Section'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { ScoreRing } from '../common/Card'
import { SCORE_METRICS, AI_SUGGESTIONS, SCORE_STATS, CHECKLIST_ITEMS } from '../../data/portfolioScore'
import { cn } from '../../utils/cn'

export function PortfolioScoreSection() {
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="PORTFOLIO SCORE"
        title={<>포트폴리오 완성도를 <span className="text-grad">AI가 분석합니다.</span></>}
        sub="Cofolio는 포트폴리오의 구성, 설명, 기술스택, 링크, 가독성을 분석해 더 설득력 있는 포트폴리오가 되도록 개선 포인트를 제안합니다."
      />
      <div className="reveal mt-14 grid grid-cols-1 lg:grid-cols-[420px,1fr] gap-5">
        {/* Score card */}
        <div className="glass-strong rounded-2xl p-6 ring-grad glow-violet">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold tracking-tight">Overall Score</div>
            <Tag tone="violet">실시간 분석</Tag>
          </div>
          <div className="mt-5 grid place-items-center">
            <ScoreRing value={86} size={208} label="PORTFOLIO SCORE" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {SCORE_STATS.map(({ label, value, tone }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
                <div className={cn('mt-1 text-[16px] font-bold', tone === 'violet' ? 'text-violet-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-indigo-300')}>{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-2">완성 체크리스트</div>
            <div className="space-y-1.5 text-[12.5px]">
              {CHECKLIST_ITEMS.map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2">
                  {ok
                    ? <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/20 text-emerald-300"><Icon name="check" size={10} /></span>
                    : <span className="grid h-4 w-4 place-items-center rounded-full bg-white/5 text-slate-500 border border-white/10"><Icon name="plus" size={10} /></span>}
                  <span className={ok ? 'text-slate-200' : 'text-slate-500'}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics + AI */}
        <div className="space-y-5">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold">세부 지표</div>
              <div className="text-[11px] text-slate-500 font-mono">scored 5분 전</div>
            </div>
            <div className="mt-5 space-y-4">
              {SCORE_METRICS.map((m) => (
                <div key={m.l}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <div className="text-slate-300">{m.l}</div>
                    <div className="font-mono text-slate-200">{m.v}%</div>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.v}%`, background: `linear-gradient(90deg, ${m.c}, ${m.c}88)` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Icon name="sparkles" size={13} /></span>
              <div className="text-[14px] font-semibold">AI 개선 제안</div>
              <Tag tone="cyan">3 actions</Tag>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {AI_SUGGESTIONS.map((s, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-violet-300/80">Suggestion {i + 1}</div>
                  <div className="mt-2 text-[12.5px] text-slate-200 leading-relaxed">{s}</div>
                  <button className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-violet-200 hover:text-violet-100">
                    적용하기 <Icon name="arrow" size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
