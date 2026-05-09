import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { PrimaryBtn, GhostBtn } from '../common/Button'
import { Icon } from '../common/Icon'

const NAV_LINKS = [
  ['기능', '#features'],
  ['작동 방식', '#workflow'],
  ['템플릿', '#templates'],
  ['예시', '#showcase'],
  ['요금제', '#pricing'],
  ['FAQ', '#faq'],
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 8)
    onS()
    window.addEventListener('scroll', onS)
    return () => window.removeEventListener('scroll', onS)
  }, [])

  return (
    <header className={cn('sticky top-0 z-50 w-full transition-all', scrolled ? 'backdrop-blur-xl bg-ink-950/70 border-b border-white/5' : 'bg-transparent')}>
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad">
            <Icon name="logo-c" size={22} />
          </div>
          <div className="text-[17px] font-bold tracking-tight">Cofolio</div>
          <span className="ml-1 hidden rounded-full border border-violet-400/25 bg-violet-500/10 px-1.5 py-[1px] text-[10px] font-semibold text-violet-200 sm:inline">BETA</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(([l, h]) => (
            <a key={l} href={h} className="rounded-lg px-3 py-1.5 text-[14px] text-slate-300 hover:bg-white/5 hover:text-white">{l}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => navigate('/login')} className="text-[14px] text-slate-300 hover:text-white px-3 py-1.5">로그인</button>
          <PrimaryBtn size="sm" onClick={() => navigate('/builder')}>
            포트폴리오 만들기 <Icon name="arrow" size={14} />
          </PrimaryBtn>
        </div>

        <button className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5" onClick={() => setOpen(!open)}>
          <Icon name="menu" size={20} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-ink-950/95 backdrop-blur-xl">
          <div className="px-5 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(([l, h]) => (
              <a key={l} href={h} className="rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5">{l}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <GhostBtn size="sm" className="flex-1" onClick={() => navigate('/login')}>로그인</GhostBtn>
              <PrimaryBtn size="sm" className="flex-1" onClick={() => navigate('/builder')}>포트폴리오 만들기</PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
