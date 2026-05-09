import { cn } from '../../utils/cn'

interface SectionProps {
  id?: string
  className?: string
  containerClassName?: string
  children: React.ReactNode
}

export function Section({ id, children, className = '', containerClassName = '' }: SectionProps) {
  return (
    <section id={id} className={cn('relative w-full px-5 sm:px-8', className)}>
      <div className={cn('mx-auto w-full max-w-[1240px]', containerClassName)}>
        {children}
      </div>
    </section>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-violet-300/90 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse"></span>
      {children}
    </div>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  sub?: string
  align?: 'center' | 'left'
}

export function SectionHeading({ eyebrow, title, sub, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4 reveal', align === 'center' ? 'items-center text-center' : 'items-start text-left')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-3xl text-balance text-[34px] sm:text-[44px] md:text-[52px] font-bold leading-[1.15] tracking-tight" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
        {title}
      </h2>
      {sub && <p className="max-w-2xl text-[15px] sm:text-[17px] leading-[1.7] text-slate-400">{sub}</p>}
    </div>
  )
}
