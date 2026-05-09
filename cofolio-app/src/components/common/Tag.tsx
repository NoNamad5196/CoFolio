import { cn } from '../../utils/cn'
import type { TagTone } from '../../types'

interface TagProps {
  children: React.ReactNode
  tone?: TagTone
}

const tones: Record<TagTone, string> = {
  violet: 'border-violet-500/25 bg-violet-500/10 text-violet-200',
  cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-200',
  indigo: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-200',
  slate: 'border-white/10 bg-white/5 text-slate-300',
  pink: 'border-pink-500/25 bg-pink-500/10 text-pink-200',
  emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200',
}

export function Tag({ children, tone = 'violet' }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium', tones[tone])}>
      {children}
    </span>
  )
}
