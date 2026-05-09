import { Section, SectionHeading } from '../common/Section'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'

const BEFORE_ITEMS = [
  '정리되지 않은 프로젝트 설명',
  '단순한 GitHub 링크 나열',
  '밋밋한 README',
  '기술스택과 역할 설명 부족',
  '채용 담당자가 보기 어려운 구성',
]

const AFTER_ITEMS = [
  '명확한 문제 해결 과정',
  '보기 좋은 프로젝트 카드',
  '기술스택과 담당 역할 정리',
  '면접에서 설명하기 쉬운 구조',
  '채용 담당자가 빠르게 이해할 수 있는 포트폴리오',
]

export function BeforeAfterSection() {
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="BEFORE / AFTER"
        title={<>흩어진 프로젝트를 <span className="text-grad">설득력 있는 포트폴리오로.</span></>}
        sub="같은 프로젝트도 정리 방식에 따라 전혀 다르게 보입니다."
      />
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div className="reveal relative rounded-2xl border border-white/8 bg-ink-900/40 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(80%_40%_at_50%_0%,rgba(120,120,140,0.08),transparent_70%)]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/15 text-rose-300 border border-rose-400/20">
                <Icon name="x" size={14} />
              </span>
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-400">Before</div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">portfolio_v0.txt</div>
          </div>

          <div className="mt-5 space-y-3 font-mono text-[12.5px]">
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500">
              <div className="text-slate-400">프로젝트 1</div>
              <div className="opacity-70">- 그냥 만들었음. 리액트 사용함.</div>
              <div className="opacity-70">- github.com/user/proj-a</div>
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500">
              <div className="opacity-70">- proj-b: 팀 프로젝트, 백엔드 담당</div>
              <div className="opacity-70">- github.com/user/proj-b</div>
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500 opacity-70">
              <div>기술: react, ts, mysql, aws, figma, ...</div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {BEFORE_ITEMS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-400">
                <Icon name="x" size={14} className="mt-1 text-rose-400/80" /> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* AFTER */}
        <div className="reveal relative rounded-2xl ring-grad bg-gradient-to-br from-ink-800/70 to-ink-900/70 p-6 overflow-hidden glow-violet">
          <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(124,58,237,0.18),transparent_70%)]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                <Icon name="check" size={14} />
              </span>
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-violet-200">After</div>
            </div>
            <Tag tone="violet">Cofolio 정리본</Tag>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Notewave · 실시간 협업 노트</div>
                <Tag tone="cyan">Frontend Lead</Tag>
              </div>
              <div className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">
                동시 편집 충돌을 줄이기 위해 OT 알고리즘을 적용해 평균 응답 지연을 <span className="text-cyan-300">120ms → 38ms</span>로 단축.
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {['React', 'TypeScript', 'WebSocket', 'Yjs'].map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-200">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Mealy · AI 식단 추천</div>
                <Tag tone="indigo">Backend</Tag>
              </div>
              <div className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">
                벡터 검색 기반 추천 시스템으로 사용자 만족도 <span className="text-cyan-300">+27%</span>, 일일 활성 사용자 <span className="text-cyan-300">2.1k</span> 달성.
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {['Next.js', 'FastAPI', 'pgvector', 'OpenAI'].map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-200">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {AFTER_ITEMS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-200">
                <Icon name="check" size={14} className="mt-1 text-emerald-400" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
