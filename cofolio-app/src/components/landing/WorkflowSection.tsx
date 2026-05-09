import { Section, SectionHeading } from '../common/Section'
import { Icon } from '../common/Icon'

const STEPS = [
  { n: '01', t: '프로젝트 정보 입력', d: '프로젝트 설명, 기술스택, GitHub 링크, 배포 링크를 입력합니다.', i: 'file' },
  { n: '02', t: 'AI가 구조와 문장을 정리', d: 'Cofolio가 프로젝트의 핵심 가치와 기술적 포인트를 자동으로 정리합니다.', i: 'sparkles' },
  { n: '03', t: '포트폴리오 생성 및 공유', d: '완성된 포트폴리오를 웹사이트로 공유하거나 README 형태로 내보낼 수 있습니다.', i: 'rocket' },
] as const

export function WorkflowSection() {
  return (
    <Section id="workflow" className="py-24">
      <SectionHeading
        eyebrow="HOW IT WORKS"
        title={<><span className="text-grad">3단계로</span> 포트폴리오를 완성하세요.</>}
        sub="입력 → 정리 → 공유. 그게 전부입니다."
      />
      <div className="relative mt-14">
        <div aria-hidden className="absolute left-0 right-0 top-[44px] hidden lg:block h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className="reveal relative" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="glass rounded-2xl p-6 lift">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-white border border-white/15">
                    <Icon name={s.i as any} size={20} />
                  </div>
                  <div className="font-mono text-[28px] text-grad-sub font-bold">{s.n}</div>
                </div>
                <div className="mt-5 text-[18px] font-semibold tracking-tight">{s.t}</div>
                <div className="mt-2 text-[13.5px] text-slate-400 leading-relaxed">{s.d}</div>

                <div className="mt-5 rounded-xl border border-white/8 bg-ink-900/60 p-3">
                  {i === 0 && (
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-500">project_name <span className="text-violet-300">Notewave</span></div>
                      <div className="flex justify-between text-slate-500">stack <span className="text-cyan-300">React, TS, WS</span></div>
                      <div className="flex justify-between text-slate-500">github <span className="text-slate-300">/user/notewave</span></div>
                      <div className="flex justify-between text-slate-500">deploy <span className="text-slate-300">notewave.app</span></div>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px]"><span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse" /><span className="text-slate-300">문장 다듬는 중…</span></div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-violet-400 to-cyan-400" /></div>
                      <div className="flex items-center gap-2 text-[11px]"><Icon name="check" size={11} className="text-emerald-400" /><span className="text-slate-400">기술스택 자동 분류</span></div>
                      <div className="flex items-center gap-2 text-[11px]"><Icon name="check" size={11} className="text-emerald-400" /><span className="text-slate-400">README 요약</span></div>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 rounded-md bg-white/[0.03] px-2 py-1.5 font-mono text-[10.5px] text-slate-400">cofolio.app/p/kim-oo</div>
                      <button className="rounded-md bg-violet-500/20 px-2 py-1.5 text-[11px] text-violet-100 border border-violet-400/30">공개하기</button>
                    </div>
                  )}
                </div>
              </div>

              {i < 2 && (
                <div className="absolute right-[-14px] top-[44px] hidden lg:flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 border border-violet-400/30 text-violet-300 z-10">
                  <Icon name="arrow" size={12} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
