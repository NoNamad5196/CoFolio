import { Section, SectionHeading } from '../common/Section'
import { Icon } from '../common/Icon'

const ITEMS = [
  { i: 'file', t: '프로젝트 설명을 어떻게 써야 할지 모름', d: '무엇을 강조해야 할지, 어떤 순서로 써야 할지 막막합니다.' },
  { i: 'github', t: 'GitHub 링크만 나열하면 매력이 잘 보이지 않음', d: '링크만으로는 프로젝트의 임팩트와 역할이 전달되지 않습니다.' },
  { i: 'palette', t: '디자인 구성이 막막함', d: '좋은 컨텐츠가 있어도 시각적으로 정돈되지 않으면 약해 보입니다.' },
  { i: 'layers', t: '기술스택과 담당 역할이 정리되지 않음', d: '무엇을 어떻게 사용했는지 명확히 보여야 신뢰가 생깁니다.' },
] as const

export function ProblemSection() {
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="WHY COFOLIO"
        title={<>포트폴리오, 만들기보다 <span className="text-grad">정리가 더 어렵습니다.</span></>}
        sub="좋은 프로젝트를 만들었어도, 제대로 설명하지 못하면 매력이 전달되지 않습니다. Cofolio는 흩어진 프로젝트 정보를 보기 좋은 포트폴리오로 정리해줍니다."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map((it, i) => (
          <div key={i} className="reveal glass lift rounded-2xl p-5 ring-grad" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-200 border border-white/10">
              <Icon name={it.i as any} size={18} />
            </div>
            <div className="mt-4 text-[15px] font-semibold leading-snug">{it.t}</div>
            <div className="mt-2 text-[13px] text-slate-400 leading-relaxed">{it.d}</div>
          </div>
        ))}
      </div>
    </Section>
  )
}
