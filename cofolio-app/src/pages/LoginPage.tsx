import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eyebrow } from '../components/common/Section'
import { PrimaryBtn } from '../components/common/Button'
import { Icon } from '../components/common/Icon'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMsg, setInfoMsg] = useState<string | null>(null)

  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/builder'

  // Already logged in → redirect
  useEffect(() => {
    if (user) navigate(from, { replace: true })
  }, [user, navigate, from])

  // ── Email submit ──────────────────────────────────────────────────────────
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setInfoMsg(null)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 주소를 입력해주세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    // Try sign in first
    const { error: signInErr } = await signIn(email, password)

    if (!signInErr) {
      // Auth state change will redirect via useEffect
      return
    }

    // "Invalid login credentials" → try sign up (auto register)
    if (signInErr.message.toLowerCase().includes('invalid login credentials') ||
        signInErr.message.toLowerCase().includes('invalid_credentials')) {
      const { error: signUpErr } = await signUp(email, password)

      if (!signUpErr) {
        // If email confirmation disabled, onAuthStateChange fires → useEffect redirects
        // If email confirmation enabled, show message
        setInfoMsg('가입이 완료됐어요! 이메일을 확인해 인증 링크를 클릭해주세요.')
        setLoading(false)
        return
      }

      setError('가입 실패: ' + signUpErr.message)
    } else {
      setError(signInErr.message)
    }

    setLoading(false)
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid opacity-30"
        style={{ maskImage: 'radial-gradient(60% 50% at 50% 30%, black, transparent)', WebkitMaskImage: 'radial-gradient(60% 50% at 50% 30%, black, transparent)' }}
      />

      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2.5 text-slate-300 hover:text-white">
        <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad"><Icon name="logo-c" size={22} /></div>
        <span className="text-[16px] font-bold tracking-tight">Cofolio</span>
      </Link>

      <div className="w-full max-w-[440px] reveal in">
        <div className="text-center">
          <Eyebrow>WELCOME BACK</Eyebrow>
          <h1 className="mt-4 text-[32px] sm:text-[36px] font-bold tracking-tight">
            로그인하고 <span className="text-grad">내 포트폴리오</span>를 이어가세요
          </h1>
          <p className="mt-3 text-[13.5px] text-slate-400">이메일 입력 시 계정이 없으면 자동으로 가입됩니다.</p>
        </div>

        <div className="mt-7 glass-strong rounded-2xl p-6 ring-grad">
          <div className="grid grid-cols-1 gap-2">
            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white text-slate-900 hover:bg-slate-100 text-[14px] font-semibold"
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 0 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.6 15 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.1z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8L6.2 33C9.5 39.5 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C40.9 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Google로 계속하기
            </button>

            {/* GitHub — 준비 중 */}
            <button
              disabled
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-[#0d1117] text-white/40 text-[14px] font-semibold cursor-not-allowed"
            >
              <Icon name="github" size={15} /> GitHub로 계속하기
              <span className="ml-1 rounded-full border border-slate-500/40 px-1.5 py-[1px] text-[9px] text-slate-500">준비 중</span>
            </button>

            {/* Kakao — 준비 중 */}
            <button
              disabled
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl bg-[#FEE500]/30 text-[#191919]/40 text-[14px] font-semibold cursor-not-allowed"
            >
              <span className="font-bold">K</span> 카카오로 계속하기
              <span className="ml-1 rounded-full border border-slate-500/40 px-1.5 py-[1px] text-[9px] text-slate-500">준비 중</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
            <div className="h-px flex-1 bg-white/8" /> 또는 이메일로 <div className="h-px flex-1 bg-white/8" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="text-[12px] text-slate-400">이메일</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[12px] text-slate-400">비밀번호</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none"
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[12.5px] text-red-300">
                {error}
              </div>
            )}
            {infoMsg && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-[12.5px] text-emerald-300">
                {infoMsg}
              </div>
            )}

            <PrimaryBtn type="submit" size="lg" className="w-full" onClick={() => submit()}>
              {loading
                ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> 처리 중…</>
                : <>로그인 / 회원가입 <Icon name="arrow" size={14} /></>}
            </PrimaryBtn>
          </form>
        </div>

        <div className="mt-5 text-center">
          <button onClick={() => navigate('/builder')} className="text-[12.5px] text-slate-400 hover:text-white">
            로그인 없이 둘러보기 →
          </button>
        </div>
      </div>
    </div>
  )
}
