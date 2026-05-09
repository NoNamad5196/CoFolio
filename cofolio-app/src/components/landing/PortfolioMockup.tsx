import { cn } from '../../utils/cn'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { WindowDots } from '../common/Card'

const MOCK_PROJECTS = [
  { t: 'Notewave', d: '실시간 협업 노트 앱', tags: ['React', 'WebSocket'], col: 'from-violet-600/40 to-indigo-600/20' },
  { t: 'Mealy', d: 'AI 기반 식단 추천', tags: ['Next.js', 'OpenAI'], col: 'from-cyan-500/40 to-blue-600/20' },
  { t: 'DesignKit', d: '디자인 시스템 라이브러리', tags: ['TypeScript', 'Storybook'], col: 'from-fuchsia-500/40 to-violet-600/20' },
]

const MOCK_STATS = [
  ['Projects', '12', 'violet'],
  ['Tech Stacks', '18', 'indigo'],
  ['Views', '2.4k', 'cyan'],
] as const

const MOCK_STACK = ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node.js', 'Prisma', 'PostgreSQL', 'Vercel', 'Figma', 'Storybook']

export function PortfolioMockup() {
  return (
    <div className="relative w-full glass-strong rounded-[20px] overflow-hidden glow-violet ring-grad">
      {/* Fake browser top */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/60">
        <WindowDots />
        <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
          <Icon name="globe" size={11} />
          <span className="font-mono">cofolio.app/p/kim-oo</span>
        </div>
        <Icon name="share" size={13} className="text-slate-500" />
      </div>

      {/* Fake page content */}
      <div className="p-5 sm:p-6">
        {/* Profile card */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 grid place-items-center text-white font-bold text-lg ring-grad">
              JK
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-ink-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[17px] font-semibold">김지호</div>
                <Tag tone="violet">Frontend Developer</Tag>
              </div>
              <div className="text-[12px] text-slate-400 mt-0.5">서울 · 3년차 · React · TypeScript · 디자인 시스템</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-200">
              <Icon name="github" size={13} /> GitHub
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[12px] text-cyan-100">
              <Icon name="rocket" size={13} /> Deploy
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {MOCK_STATS.map(([l, v, c]) => (
            <div key={l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <div className={cn('text-2xl font-bold', c === 'violet' ? 'text-violet-300' : c === 'indigo' ? 'text-indigo-300' : 'text-cyan-300')}>{v}</div>
                <div className="text-[10px] text-emerald-400">↑ 12%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-slate-200">Featured Projects</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500"><Icon name="folder" size={11} /> 12 projects</div>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MOCK_PROJECTS.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.02]">
              <div className={cn('h-16 bg-gradient-to-br stripes', p.col)} />
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12.5px] font-semibold">{p.t}</div>
                  <Icon name="link" size={12} className="text-slate-500" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{p.d}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="mt-5">
          <div className="text-[13px] font-semibold text-slate-200 mb-2">Tech Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {MOCK_STACK.map((t) => (
              <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-200 font-mono">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
