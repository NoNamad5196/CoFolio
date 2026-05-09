// Login page — email + Google + GitHub + Kakao social options

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate(ROUTES.BUILDER); }, 700);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-10 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet"></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" style={{maskImage:"radial-gradient(60% 50% at 50% 30%, black, transparent)", WebkitMaskImage:"radial-gradient(60% 50% at 50% 30%, black, transparent)"}}></div>

      <a href="#/" className="absolute top-6 left-6 flex items-center gap-2.5 text-slate-300 hover:text-white">
        <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad"><Ico name="logo-c" size={22}/></div>
        <span className="text-[16px] font-bold tracking-tight">Cofolio</span>
      </a>

      <div className="w-full max-w-[440px] reveal in">
        <div className="text-center">
          <Eyebrow>WELCOME BACK</Eyebrow>
          <h1 className="mt-4 text-[32px] sm:text-[36px] font-bold tracking-tight">로그인하고 <span className="text-grad">내 포트폴리오</span>를 이어가세요</h1>
          <p className="mt-3 text-[13.5px] text-slate-400">계정이 없다면 회원가입 없이 바로 시작할 수 있습니다.</p>
        </div>

        <div className="mt-7 glass-strong rounded-2xl p-6 ring-grad">
          <div className="grid grid-cols-1 gap-2">
            <button onClick={submit} className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white text-slate-900 hover:bg-slate-100 text-[14px] font-semibold">
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 0 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-9 20-20 0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.6 15 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.1z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8L6.2 33C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C40.9 36 44 30.5 44 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
              Google로 계속하기
            </button>
            <button onClick={submit} className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-[#0d1117] hover:bg-[#1a2230] text-white text-[14px] font-semibold">
              <Ico name="github" size={15}/> GitHub로 계속하기
            </button>
            <button onClick={submit} className="flex h-11 items-center justify-center gap-2.5 rounded-xl bg-[#FEE500] hover:bg-[#fdd835] text-[#191919] text-[14px] font-semibold">
              <span className="font-bold">K</span> 카카오로 계속하기
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] text-slate-500">
            <div className="h-px flex-1 bg-white/8"></div> 또는 이메일로 <div className="h-px flex-1 bg-white/8"></div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="text-[12px] text-slate-400">이메일</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none" />
            </label>
            <label className="block">
              <span className="text-[12px] text-slate-400">비밀번호</span>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-[14px] text-white placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] outline-none" />
            </label>
            <div className="flex items-center justify-between text-[12px]">
              <label className="inline-flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="h-3.5 w-3.5 accent-violet-500"/> 로그인 유지
              </label>
              <a className="text-violet-300 hover:text-violet-200 cursor-pointer">비밀번호 찾기</a>
            </div>
            <PrimaryBtn type="submit" size="lg" className="w-full">
              {loading ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></span> 로그인 중…</> : <>로그인 <Ico name="arrow" size={14}/></>}
            </PrimaryBtn>
          </form>

          <div className="mt-5 text-center text-[12.5px] text-slate-400">
            계정이 없으신가요? <a className="text-violet-300 hover:text-violet-200 cursor-pointer">회원가입</a>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button onClick={() => navigate(ROUTES.BUILDER)} className="text-[12.5px] text-slate-400 hover:text-white">
            로그인 없이 둘러보기 →
          </button>
        </div>
      </div>
    </div>
  );
};

window.LoginPage = LoginPage;
