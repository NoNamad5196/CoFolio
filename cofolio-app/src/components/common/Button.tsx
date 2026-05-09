import { cn } from '../../utils/cn'
import type { ButtonSize } from '../../types'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  className?: string
  children?: React.ReactNode
}

export function PrimaryBtn({ children, size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  const sz = size === 'lg' ? 'h-12 px-6 text-[15px]' : size === 'sm' ? 'h-9 px-4 text-[13px]' : 'h-11 px-5 text-[14px]'
  return (
    <button
      type={type}
      className={cn('btn-primary inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white', sz, className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function GhostBtn({ children, size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
  const sz = size === 'lg' ? 'h-12 px-6 text-[15px]' : size === 'sm' ? 'h-9 px-4 text-[13px]' : 'h-11 px-5 text-[14px]'
  return (
    <button
      type={type}
      className={cn('btn-ghost inline-flex items-center justify-center gap-2 rounded-xl font-medium text-slate-100', sz, className)}
      {...rest}
    >
      {children}
    </button>
  )
}
