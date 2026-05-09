import { cn } from '../../utils/cn'

export function FloatingCard({
  className = '',
  children,
  anim = 'anim-float-1',
}: {
  className?: string
  children: React.ReactNode
  anim?: string
}) {
  return (
    <div className={cn('glass-strong rounded-2xl p-3 shadow-[0_20px_60px_-20px_rgba(124,58,237,0.45)]', anim, className)}>
      {children}
    </div>
  )
}

export function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80"></span>
      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80"></span>
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></span>
    </div>
  )
}

export function SparkArea({
  values,
  color = '#a78bfa',
  width = 220,
  height = 60,
}: {
  values: number[]
  color?: string
  width?: number
  height?: number
}) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const w = width
  const h = height
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4
    return [x, y]
  })
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area = `${d} L${w},${h} L0,${h} Z`
  const id = 'g' + Math.random().toString(36).slice(2, 7)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.5" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  )
}

export function ScoreRing({
  value = 86,
  size = 168,
  label = 'Portfolio Score',
}: {
  value?: number
  size?: number
  label?: string
}) {
  const p = Math.max(0, Math.min(100, value))
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div
        className="ring-prog rounded-full"
        style={{ width: size, height: size, ['--p' as string]: `${p}%` }}
      ></div>
      <div
        className="absolute rounded-full bg-ink-900/90"
        style={{ width: size - 16, height: size - 16 }}
      ></div>
      <div className="absolute flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-grad text-5xl font-bold leading-none tracking-tight">{p}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-300">+4 since last week</div>
      </div>
    </div>
  )
}
