import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Icon } from '../components/common/Icon'

const STEPS_AI = [
  { l: '프로젝트 정보 분석 중', d: '입력한 데이터에서 핵심 키워드 추출' },
  { l: '기술스택 자동 분류 중', d: 'Frontend / Backend / AI 등으로 그룹핑' },
  { l: '프로젝트 설명 다듬는 중', d: '문제 → 해결 → 결과 순으로 재정리' },
  { l: '자기소개 문장 개선 중', d: '전문성과 자연스러움을 균형 있게' },
  { l: '면접 질문 생성 중', d: '프로젝트 기반 예상 질문 8개 생성' },
  { l: 'Portfolio Score 계산 중', d: '5개 지표로 완성도 측정' },
]

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const navigate = useNavigate()
  const total = STEPS_AI.length

  useEffect(() => {
    const totalMs = 4500
    const t0 = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - t0) / totalMs)
      setProgress(elapsed)
      setStepIdx(Math.min(total - 1, Math.floor(elapsed * total)))
      if (elapsed < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => navigate('/result'), 400)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [navigate, total])

  const pct = Math.round(progress * 100)

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="w-full max-w-[760px] reveal in">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[12px] text-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse" /> AI 생성 중
          </div>
          <h1 className="mt-5 text-[32px] sm:text-[40px] font-bold tracking-tight">
            포트폴리오를 <span className="text-grad">만들고 있어요</span>
          </h1>
          <p className="mt-3 text-[13.5px] text-slate-400">잠시만 기다려 주세요. 평균 5초 정도 걸려요.</p>
        </div>

        <div className="mt-8 glass-strong rounded-2xl p-6 ring-grad">
          <div className="flex items-end justify-between mb-2">
            <div className="text-[13px] font-semibold text-slate-200">진행 상황</div>
            <div className="text-[13px] font-mono text-cyan-300">{pct}%</div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-6 space-y-2.5">
            {STEPS_AI.map((s, i) => {
              const done = i < stepIdx
              const active = i === stepIdx
              return (
                <div
                  key={s.l}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition',
                    done ? 'border-emerald-400/20 bg-emerald-500/[0.04]' :
                    active ? 'border-violet-400/30 bg-violet-500/[0.06]' :
                    'border-white/8 bg-white/[0.02]'
                  )}
                >
                  <div className={cn(
                    'mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0',
                    done ? 'bg-emerald-500/25 text-emerald-200' :
                    active ? 'bg-violet-500/25 text-violet-100' :
                    'bg-white/5 text-slate-500'
                  )}>
                    {done ? <Icon name="check" size={11} /> :
                     active ? <span className="h-2 w-2 rounded-full bg-violet-300 anim-pulse" /> :
                     <span className="text-[10px]">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-[13px] font-medium', done ? 'text-slate-300' : active ? 'text-white' : 'text-slate-500')}>{s.l}</div>
                    <div className="text-[11.5px] text-slate-500">{s.d}</div>
                  </div>
                  {active && <div className="text-[11px] text-violet-300 font-mono">처리 중…</div>}
                  {done && <div className="text-[11px] text-emerald-300">완료</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Fake terminal */}
        <div className="mt-5 rounded-xl border border-white/8 bg-ink-950/80 p-3 font-mono text-[11.5px] leading-relaxed text-slate-400 nosb max-h-[120px] overflow-hidden">
          <div><span className="text-violet-300">→</span> cofolio analyze --input ./portfolio.json</div>
          <div><span className="text-cyan-300">✓</span> parsed {Math.floor(progress * 8) + 2} sections</div>
          <div><span className="text-cyan-300">✓</span> classified tech stack into 5 groups</div>
          {progress > 0.5 && <div><span className="text-cyan-300">✓</span> rewrote 12 sentences with --tone professional</div>}
          {progress > 0.75 && <div><span className="text-cyan-300">✓</span> generated 8 interview questions</div>}
          {progress >= 0.99 && <div><span className="text-emerald-300">✓</span> portfolio score: 86/100</div>}
        </div>
      </div>
    </div>
  )
}
