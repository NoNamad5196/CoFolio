import { Section, SectionHeading } from '../common/Section'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { WindowDots, ScoreRing, SparkArea } from '../common/Card'
import { cn } from '../../utils/cn'

const STACK_DATA = [
  { l: 'Frontend', v: 42, c: '#a78bfa' },
  { l: 'Backend', v: 24, c: '#6366f1' },
  { l: 'AI', v: 18, c: '#22d3ee' },
  { l: 'Database', v: 10, c: '#60a5fa' },
  { l: 'Deploy', v: 6, c: '#34d399' },
]

const PROJECTS = [
  { n: 'Notewave', d: '실시간 협업 노트', s: 92, tags: ['React', 'TS', 'WS'], status: '공개' },
  { n: 'Mealy', d: 'AI 식단 추천', s: 88, tags: ['Next.js', 'FastAPI'], status: '공개' },
  { n: 'DesignKit', d: '디자인 시스템 라이브러리', s: 81, tags: ['TS', 'Storybook'], status: '임시저장' },
  { n: 'Trailmap', d: '등산 코스 추천', s: 74, tags: ['React Native'], status: '임시저장' },
]

const AI_SUGGESTIONS = [
  { t: 'Mealy 프로젝트에 배포 링크가 없습니다.', a: '링크 추가', tone: 'violet' },
  { t: "Notewave의 '담당 역할' 한 줄 추가를 제안합니다.", a: '문장 생성', tone: 'cyan' },
  { t: '기술스택을 카테고리별로 그룹핑해보세요.', a: '자동 정리', tone: 'indigo' },
]

const SIDEBAR_LINKS = [
  ['overview', '대시보드', 'chart', true],
  ['projects', '프로젝트', 'folder', false],
  ['stack', '기술스택', 'layers', false],
  ['templates', '템플릿', 'palette', false],
  ['score', 'Portfolio Score', 'sparkles', false],
  ['share', '공유 / 배포', 'rocket', false],
] as const

export function DashboardPreviewSection() {
  return (
    <Section id="dashboard" className="py-24">
      <SectionHeading
        eyebrow="APP PREVIEW"
        title={<>포트폴리오 제작 과정을 <span className="text-grad">한눈에 관리하세요.</span></>}
        sub="프로젝트 정리부터 공개까지, Cofolio 대시보드에서 모두 처리됩니다."
      />

      <div className="reveal mt-14 rounded-[20px] glass-strong overflow-hidden glow-violet ring-grad">
        {/* App top bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-ink-900/60">
          <div className="flex items-center gap-3">
            <WindowDots />
            <div className="ml-2 flex items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 font-mono">
              <Icon name="logo-c" size={11} /> cofolio.app/dashboard
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] text-slate-200">
              <Icon name="download" size={12} /> README 내보내기
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-3 py-1.5 text-[11.5px] text-white font-semibold">
              <Icon name="rocket" size={12} /> 공개하기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] min-h-[640px]">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 border-r border-white/5 bg-ink-900/40 p-3">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspace</div>
            {SIDEBAR_LINKS.map(([k, l, i, active]) => (
              <button key={k} className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]',
                active ? 'bg-violet-500/15 text-violet-100 border border-violet-400/20' : 'text-slate-300 hover:bg-white/5'
              )}>
                <Icon name={i as any} size={14} /> {l}
              </button>
            ))}
            <div className="mt-auto rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400">Pro 플랜 7일 남음</div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-violet-400 to-cyan-400" />
              </div>
              <button className="mt-2 w-full rounded-md bg-white/5 hover:bg-white/10 text-[11px] py-1.5">업그레이드</button>
            </div>
          </aside>

          {/* Main content */}
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-slate-500">안녕하세요, 김지호님</div>
                <div className="text-[20px] font-semibold tracking-tight">포트폴리오 작업실</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 h-9 text-[12px] text-slate-400">
                  <Icon name="search" size={12} /> 프로젝트 검색
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-3 h-9 text-[12px] font-semibold text-white">
                  <Icon name="plus" size={12} /> 새 프로젝트
                </button>
              </div>
            </div>

            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <ScoreRing value={86} size={120} label="PORTFOLIO SCORE" />
                <div className="flex-1">
                  <div className="text-[12px] text-slate-400">Recently edited</div>
                  <div className="text-[14px] font-semibold mt-0.5">Notewave · 협업 노트</div>
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    {[['설명', 92], ['스택', 88], ['링크', 76]].map(([l, v]) => (
                      <div key={l} className="flex items-center gap-2">
                        <div className="w-12 text-slate-400">{l}</div>
                        <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: `${v}%` }} />
                        </div>
                        <div className="w-8 text-right text-slate-300 font-mono">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold">기술스택 분포</div>
                  <Tag tone="slate">최근 30일</Tag>
                </div>
                <div className="mt-4 space-y-2">
                  {STACK_DATA.map((s) => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-16 text-[11.5px] text-slate-300">{s.l}</div>
                      <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.v * 2}%`, background: `linear-gradient(90deg, ${s.c}, ${s.c}aa)` }} />
                      </div>
                      <div className="w-9 text-right text-[11px] font-mono text-slate-300">{s.v}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold">방문자 통계</div>
                  <div className="text-[11px] text-emerald-400 inline-flex items-center gap-1"><Icon name="zap" size={11} /> +18%</div>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <div className="text-[28px] font-bold">2,432</div>
                  <div className="text-[11px] text-slate-500">최근 7일</div>
                </div>
                <div className="mt-2"><SparkArea values={[12, 18, 14, 22, 26, 20, 32, 28, 38, 42, 36, 48]} color="#22d3ee" width={260} height={70} /></div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">검색</div><div className="text-slate-200 font-semibold">42%</div></div>
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">직접</div><div className="text-slate-200 font-semibold">31%</div></div>
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">SNS</div><div className="text-slate-200 font-semibold">27%</div></div>
                </div>
              </div>
            </div>

            {/* Projects + AI panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4">
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold">프로젝트 목록</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500"><Icon name="folder" size={11} /> 12 projects</div>
                </div>
                <div className="space-y-2">
                  {PROJECTS.map((p, i) => (
                    <div key={p.n} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04]">
                      <div className={cn(
                        'h-9 w-9 rounded-lg grid place-items-center text-[12px] font-bold border border-white/10',
                        i % 3 === 0 ? 'bg-violet-500/20 text-violet-200' : i % 3 === 1 ? 'bg-cyan-500/20 text-cyan-200' : 'bg-indigo-500/20 text-indigo-200'
                      )}>
                        {p.n.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[13px] font-semibold truncate">{p.n}</div>
                          <span className={cn(
                            'rounded-full px-1.5 py-0.5 text-[10px] border',
                            p.status === '공개' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30' : 'text-slate-300 bg-white/5 border-white/10'
                          )}>{p.status}</span>
                        </div>
                        <div className="text-[11.5px] text-slate-400 truncate">{p.d}</div>
                      </div>
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {p.tags.map((t) => <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{t}</span>)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] text-slate-400">Score</div>
                        <div className="font-mono text-[12.5px] text-violet-200 font-semibold">{p.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Icon name="sparkles" size={13} /></span>
                    <div className="text-[13px] font-semibold">AI 개선 제안</div>
                  </div>
                  <Tag tone="violet">3</Tag>
                </div>
                <div className="space-y-2.5">
                  {AI_SUGGESTIONS.map((s, i) => (
                    <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <div className="text-[12.5px] text-slate-200 leading-relaxed">{s.t}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">방금 전</div>
                        <button className={cn(
                          'rounded-md px-2.5 py-1 text-[11px] border',
                          s.tone === 'violet' ? 'bg-violet-500/15 text-violet-100 border-violet-400/30' :
                          s.tone === 'cyan' ? 'bg-cyan-500/15 text-cyan-100 border-cyan-400/30' :
                          'bg-indigo-500/15 text-indigo-100 border-indigo-400/30'
                        )}>{s.a}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
