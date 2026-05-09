import { useNavigate } from 'react-router-dom'
import { Section } from '../common/Section'
import { Eyebrow } from '../common/Section'
import { PrimaryBtn, GhostBtn } from '../common/Button'
import { Icon } from '../common/Icon'

export function FinalCTASection() {
  const navigate = useNavigate()

  return (
    <Section className="py-24">
      <div className="reveal relative overflow-hidden rounded-[28px] glass-strong ring-grad p-10 sm:p-16 text-center">
        <div className="absolute inset-0 -z-0 bg-radial-violet" />
        <div
          className="absolute inset-0 -z-0 bg-grid opacity-30"
          style={{ maskImage: 'radial-gradient(70% 60% at 50% 50%, black, transparent)', WebkitMaskImage: 'radial-gradient(70% 60% at 50% 50%, black, transparent)' }}
        />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[640px] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-64 w-[640px] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative">
          <Eyebrow>READY?</Eyebrow>
          <h2 className="mt-5 text-[40px] sm:text-[56px] md:text-[64px] font-bold leading-[1.05] tracking-tight">
            이제 프로젝트를 <br className="sm:hidden" />
            <span className="text-grad">더 잘 보여주세요.</span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-[15px] sm:text-[16px] text-slate-300 leading-[1.7]">
            Cofolio로 흩어진 프로젝트를 정리하고, 채용 담당자가 보기 좋은 포트폴리오로 완성하세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PrimaryBtn size="lg" onClick={() => navigate('/builder')}>
              <Icon name="sparkles" size={16} /> 무료로 시작하기
            </PrimaryBtn>
            <GhostBtn size="lg" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="layers" size={16} /> 템플릿 둘러보기
            </GhostBtn>
          </div>
          <div className="mt-6 text-[12px] text-slate-500">신용카드 등록 없이 시작 · 언제든지 취소 가능</div>
        </div>
      </div>
    </Section>
  )
}
