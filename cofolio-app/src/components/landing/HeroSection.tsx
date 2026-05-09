import { useNavigate } from 'react-router-dom'
import { Section } from '../common/Section'
import { Eyebrow } from '../common/Section'
import { PrimaryBtn, GhostBtn } from '../common/Button'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { FloatingCard } from '../common/Card'
import { PortfolioMockup } from './PortfolioMockup'

const FEATURE_BADGES = ['코딩 없이 시작', 'AI 기반 문장 개선', '개발자 포트폴리오 최적화', '반응형 템플릿 제공']
const AVATAR_COLORS = ['#7c3aed', '#06b6d4', '#6366f1', '#a78bfa']

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <Section id="top" className="pt-10 pb-24 sm:pt-14 sm:pb-32">
      <div className="absolute inset-0 -z-10 bg-radial-violet" />
      <div
        className="absolute inset-0 -z-10 bg-grid opacity-[0.5]"
        style={{ maskImage: 'radial-gradient(60% 50% at 50% 30%, black, transparent)', WebkitMaskImage: 'radial-gradient(60% 50% at 50% 30%, black, transparent)' }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.05fr] gap-10 items-center">
        <div className="reveal">
          <Eyebrow>AI 포트폴리오 빌더 · 2026 시즌 1</Eyebrow>
          <h1 className="mt-5 text-[40px] sm:text-[56px] md:text-[64px] font-bold leading-[1.05] tracking-tight max-w-[640px]">
            프로젝트를 입력하면,<br />
            <span className="text-grad">포트폴리오가 완성됩니다.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] sm:text-[17px] leading-[1.75] text-slate-400">
            프로젝트 설명, 기술스택, GitHub 링크만 입력하면 — Cofolio AI가 채용 담당자가 보기 좋은 포트폴리오 웹사이트를 5분 안에 만들어 드립니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryBtn size="lg" onClick={() => navigate('/builder')}>
              <Icon name="sparkles" size={16} /> 포트폴리오 만들기
            </PrimaryBtn>
            <GhostBtn size="lg" onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="eye" size={16} /> 예시 포트폴리오 보기
            </GhostBtn>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {FEATURE_BADGES.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-300">
                <Icon name="check" size={12} className="text-emerald-400" /> {b}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 text-[12px] text-slate-500">
            <div className="flex -space-x-2">
              {AVATAR_COLORS.map((c, i) => (
                <div key={i} className="h-7 w-7 rounded-full ring-2 ring-ink-950" style={{ background: `linear-gradient(135deg, ${c}, #1e293b)` }} />
              ))}
            </div>
            <div>이미 <span className="text-slate-200 font-semibold">10+</span> 명의 얼리 유저가 함께하고 있어요</div>
          </div>
        </div>

        <div className="relative reveal">
          <PortfolioMockup />

          <FloatingCard anim="anim-float-1" className="absolute -left-3 sm:-left-10 -top-6 w-[260px] hidden sm:block">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300"><Icon name="check" size={16} /></div>
              <div>
                <div className="text-[12px] font-semibold">README 자동 정리 완료</div>
                <div className="text-[11px] text-slate-400">3개 프로젝트 적용됨 · 방금 전</div>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard anim="anim-float-2" className="absolute -right-3 sm:-right-8 top-24 w-[260px] hidden sm:block">
            <div className="px-2 py-1.5">
              <div className="flex items-center gap-2 text-[11px] text-violet-300">
                <Icon name="wand" size={12} /> AI 문장 개선
              </div>
              <div className="text-[12.5px] mt-1 text-slate-200 leading-relaxed">
                <span className="text-slate-500 line-through">"그냥 만들었어요"</span>
                <span className="block">→ <span className="text-violet-200">"실시간 충돌 해결을 위해 OT 알고리즘을 적용했습니다."</span></span>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard anim="anim-float-3" className="absolute -left-2 sm:-left-12 bottom-20 w-[230px] hidden sm:block">
            <div className="px-2 py-1.5">
              <div className="text-[11px] text-cyan-300 mb-1.5 flex items-center gap-1"><Icon name="layers" size={12} /> 기술스택 자동 분류</div>
              <div className="flex flex-wrap gap-1">
                {[['React', 'violet'], ['TypeScript', 'indigo'], ['Tailwind', 'cyan']].map(([t, c]) => (
                  <Tag key={t} tone={c as any}>{t}</Tag>
                ))}
              </div>
            </div>
          </FloatingCard>

          <FloatingCard anim="anim-float-1" className="absolute right-2 sm:-right-6 -bottom-6 w-[240px] hidden sm:block">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Icon name="msg" size={16} /></div>
              <div>
                <div className="text-[12px] font-semibold">면접 질문 8개 생성</div>
                <div className="text-[11px] text-slate-400">Notewave · 답변 포인트 포함</div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </Section>
  )
}
