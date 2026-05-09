import { Section, SectionHeading } from '../common/Section'
import { Icon } from '../common/Icon'
import { cn } from '../../utils/cn'

const FEATURES = [
  { i: 'sparkles', t: 'AI 프로젝트 설명 생성', d: '입력한 프로젝트 내용을 기반으로 문제, 해결 과정, 기술적 성과를 보기 좋게 정리합니다.', tone: 'violet' },
  { i: 'layers', t: '기술스택 자동 정리', d: '사용한 기술을 Frontend, Backend, AI, Database, Deploy 등으로 자동 분류합니다.', tone: 'cyan' },
  { i: 'palette', t: '포트폴리오 템플릿 선택', d: '개발자, 디자이너, 학생, 취업 준비생에게 맞는 템플릿을 제공합니다.', tone: 'indigo' },
  { i: 'github', t: 'GitHub 프로젝트 카드', d: 'GitHub 링크를 보기 좋은 프로젝트 카드로 변환합니다.', tone: 'violet' },
  { i: 'wand', t: '자기소개/경력 문장 개선', d: '밋밋한 자기소개를 더 전문적이고 자연스러운 문장으로 다듬습니다.', tone: 'cyan' },
  { i: 'msg', t: '면접 질문 자동 생성', d: '프로젝트 내용을 기반으로 예상 면접 질문과 답변 포인트를 생성합니다.', tone: 'indigo' },
] as const

export function FeatureSection() {
  return (
    <Section id="features" className="py-24">
      <SectionHeading
        eyebrow="FEATURES"
        title={<>AI가 포트폴리오 제작 과정을 <span className="text-grad">함께 도와줍니다.</span></>}
        sub="단순한 템플릿 제공이 아닌, 글쓰기·구조·디자인까지 함께 다듬는 AI 코파일럿입니다."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((it, i) => (
          <div key={i} className="reveal group relative glass lift rounded-2xl p-6 overflow-hidden" style={{ transitionDelay: `${i * 50}ms` }}>
            <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl group-hover:bg-violet-500/20" />
            <div className={cn(
              'grid h-11 w-11 place-items-center rounded-xl border border-white/10',
              it.tone === 'violet' ? 'bg-violet-500/15 text-violet-200' :
              it.tone === 'cyan' ? 'bg-cyan-500/15 text-cyan-200' :
              'bg-indigo-500/15 text-indigo-200'
            )}>
              <Icon name={it.i as any} size={20} />
            </div>
            <div className="mt-5 text-[17px] font-semibold tracking-tight">{it.t}</div>
            <div className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{it.d}</div>
            <div className="mt-5 flex items-center gap-1.5 text-[12px] text-violet-300/80 opacity-0 transition group-hover:opacity-100">
              자세히 보기 <Icon name="arrow" size={12} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
