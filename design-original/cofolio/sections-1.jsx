// Sections 1: Nav, Hero, Problem, Features

const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 8);
    onS();window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);
  const links = [
  ["기능", "#features"],
  ["작동 방식", "#workflow"],
  ["템플릿", "#templates"],
  ["예시", "#showcase"],
  ["요금제", "#pricing"],
  ["FAQ", "#faq"]];

  return (
    <header className={cls("sticky top-0 z-50 w-full transition-all", scrolled ? "backdrop-blur-xl bg-ink-950/70 border-b border-white/5" : "bg-transparent")}>
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad">
            <Ico name="logo-c" size={22} />
          </div>
          <div className="text-[17px] font-bold tracking-tight">Cofolio</div>
          <span className="ml-1 hidden rounded-full border border-violet-400/25 bg-violet-500/10 px-1.5 py-[1px] text-[10px] font-semibold text-violet-200 sm:inline">BETA</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([l, h]) =>
          <a key={l} href={h} className="rounded-lg px-3 py-1.5 text-[14px] text-slate-300 hover:bg-white/5 hover:text-white">{l}</a>
          )}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => navigate('/login')} className="text-[14px] text-slate-300 hover:text-white px-3 py-1.5">로그인</button>
          <PrimaryBtn size="sm" onClick={() => navigate('/builder')}>포트폴리오 만들기 <Ico name="arrow" size={14} /></PrimaryBtn>
        </div>
        <button className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5" onClick={() => setOpen(!open)}>
          <Ico name="menu" size={20} />
        </button>
      </div>
      {open &&
      <div className="md:hidden border-t border-white/5 bg-ink-950/95 backdrop-blur-xl">
          <div className="px-5 py-3 flex flex-col gap-1">
            {links.map(([l, h]) => <a key={l} href={h} className="rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5">{l}</a>)}
            <div className="mt-2 flex gap-2"><GhostBtn size="sm" className="flex-1" onClick={() => navigate('/login')}>로그인</GhostBtn><PrimaryBtn size="sm" className="flex-1" onClick={() => navigate('/builder')}>포트폴리오 만들기</PrimaryBtn></div>
          </div>
        </div>
      }
    </header>);

};

// Hero portfolio mockup (the big one on the right)
const PortfolioMockup = () =>
<div className="relative w-full glass-strong rounded-[20px] overflow-hidden glow-violet ring-grad">
    {/* fake browser top */}
    <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/60">
      <WindowDots />
      <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
        <Ico name="globe" size={11} />
        <span className="font-mono">cofolio.app/p/kim-oo</span>
      </div>
      <Ico name="share" size={13} className="text-slate-500" />
    </div>

    {/* fake page */}
    <div className="p-5 sm:p-6">
      {/* profile card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 grid place-items-center text-white font-bold text-lg ring-grad">
            JK
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-ink-900"></span>
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
            <Ico name="github" size={13} /> GitHub
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[12px] text-cyan-100">
            <Ico name="rocket" size={13} /> Deploy
          </div>
        </div>
      </div>

      {/* stat row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[["Projects", "12", "violet"], ["Tech Stacks", "18", "indigo"], ["Views", "2.4k", "cyan"]].map(([l, v, c]) =>
      <div key={l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <div className={cls("text-2xl font-bold", c === "violet" ? "text-violet-300" : c === "indigo" ? "text-indigo-300" : "text-cyan-300")}>{v}</div>
              <div className="text-[10px] text-emerald-400">↑ 12%</div>
            </div>
          </div>
      )}
      </div>

      {/* projects */}
      <div className="mt-5 flex items-center justify-between">
        <div className="text-[13px] font-semibold text-slate-200">Featured Projects</div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500"><Ico name="folder" size={11} /> 12 projects</div>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
      { t: "Notewave", d: "실시간 협업 노트 앱", tags: ["React", "WebSocket"], col: "from-violet-600/40 to-indigo-600/20" },
      { t: "Mealy", d: "AI 기반 식단 추천", tags: ["Next.js", "OpenAI"], col: "from-cyan-500/40 to-blue-600/20" },
      { t: "DesignKit", d: "디자인 시스템 라이브러리", tags: ["TypeScript", "Storybook"], col: "from-fuchsia-500/40 to-violet-600/20" }].
      map((p, i) =>
      <div key={i} className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.02]">
            <div className={cls("h-16 bg-gradient-to-br stripes", p.col)}></div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-[12.5px] font-semibold">{p.t}</div>
                <Ico name="link" size={12} className="text-slate-500" />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">{p.d}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.tags.map((t) => <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">{t}</span>)}
              </div>
            </div>
          </div>
      )}
      </div>

      {/* tech stack */}
      <div className="mt-5">
        <div className="text-[13px] font-semibold text-slate-200 mb-2">Tech Stack</div>
        <div className="flex flex-wrap gap-1.5">
          {["React", "TypeScript", "Tailwind", "Next.js", "Node.js", "Prisma", "PostgreSQL", "Vercel", "Figma", "Storybook"].map((t) =>
        <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-200 font-mono">{t}</span>
        )}
        </div>
      </div>
    </div>
  </div>;


const Hero = () =>
<Section id="top" className="pt-10 pb-24 sm:pt-14 sm:pb-32">
    <div className="absolute inset-0 -z-10 bg-radial-violet"></div>
    <div className="absolute inset-0 -z-10 bg-grid opacity-[0.5]" style={{ maskImage: "radial-gradient(60% 50% at 50% 30%, black, transparent)", WebkitMaskImage: "radial-gradient(60% 50% at 50% 30%, black, transparent)" }}></div>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.05fr] gap-10 items-center">
      <div className="reveal">
        <Eyebrow>AI 포트폴리오 빌더 · 2026 시즌 1</Eyebrow>
        <h1 className="mt-5 text-[40px] sm:text-[56px] md:text-[64px] font-bold leading-[1.05] tracking-tight max-w-[640px]">
          프로젝트를 입력하면,<br />
          <span className="text-grad">포트폴리오가 완성됩니다.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] sm:text-[17px] leading-[1.75] text-slate-400">
          프로젝트 설명, 기술스택, GitHub 링크만 입력하면 — Cofolio AI가 채용 담당자가 보기 좋은 포트폴리오 웹사이트를 5분 안에 만들어 드립니다.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <PrimaryBtn size="lg" onClick={() => navigate('/builder')}><Ico name="sparkles" size={16} /> 포트폴리오 만들기</PrimaryBtn>
          <GhostBtn size="lg" onClick={() => { document.getElementById('showcase')?.scrollIntoView({behavior:'smooth'}); }}><Ico name="eye" size={16} /> 예시 포트폴리오 보기</GhostBtn>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          {["코딩 없이 시작", "AI 기반 문장 개선", "개발자 포트폴리오 최적화", "반응형 템플릿 제공"].map((b) =>
        <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-300">
              <Ico name="check" size={12} className="text-emerald-400" /> {b}
            </span>
        )}
        </div>
        <div className="mt-8 flex items-center gap-3 text-[12px] text-slate-500">
          <div className="flex -space-x-2">
            {["#7c3aed", "#06b6d4", "#6366f1", "#a78bfa"].map((c, i) =>
          <div key={i} className="h-7 w-7 rounded-full ring-2 ring-ink-950" style={{ background: `linear-gradient(135deg, ${c}, #1e293b)` }}></div>
          )}
          </div>
          <div>이미 <span className="text-slate-200 font-semibold">10+</span> 명의 얼리 유저가 함께하고 있어요</div>
        </div>
      </div>

      <div className="relative reveal">
        <PortfolioMockup />

        {/* Floating cards */}
        <FloatingCard anim="anim-float-1" className="absolute -left-3 sm:-left-10 -top-6 w-[260px] hidden sm:block">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300"><Ico name="check" size={16} /></div>
            <div>
              <div className="text-[12px] font-semibold">README 자동 정리 완료</div>
              <div className="text-[11px] text-slate-400">3개 프로젝트 적용됨 · 방금 전</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard anim="anim-float-2" className="absolute -right-3 sm:-right-8 top-24 w-[260px] hidden sm:block">
          <div className="px-2 py-1.5">
            <div className="flex items-center gap-2 text-[11px] text-violet-300">
              <Ico name="wand" size={12} /> AI 문장 개선
            </div>
            <div className="text-[12.5px] mt-1 text-slate-200 leading-relaxed">
              <span className="text-slate-500 line-through">“그냥 만들었어요”</span>
              <span className="block">→ <span className="text-violet-200">“실시간 충돌 해결을 위해 OT 알고리즘을 적용했습니다.”</span></span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard anim="anim-float-3" className="absolute -left-2 sm:-left-12 bottom-20 w-[230px] hidden sm:block">
          <div className="px-2 py-1.5">
            <div className="text-[11px] text-cyan-300 mb-1.5 flex items-center gap-1"><Ico name="layers" size={12} /> 기술스택 자동 분류</div>
            <div className="flex flex-wrap gap-1">
              {[["React", "violet"], ["TypeScript", "indigo"], ["Tailwind", "cyan"]].map(([t, c]) => <Tag key={t} tone={c}>{t}</Tag>)}
            </div>
          </div>
        </FloatingCard>

        <FloatingCard anim="anim-float-1" className="absolute right-2 sm:-right-6 -bottom-6 w-[240px] hidden sm:block">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/15 text-violet-300"><Ico name="msg" size={16} /></div>
            <div>
              <div className="text-[12px] font-semibold">면접 질문 8개 생성</div>
              <div className="text-[11px] text-slate-400">Notewave · 답변 포인트 포함</div>
            </div>
          </div>
        </FloatingCard>
      </div>
    </div>
  </Section>;


const Problem = () => {
  const items = [
  { i: "file", t: "프로젝트 설명을 어떻게 써야 할지 모름", d: "무엇을 강조해야 할지, 어떤 순서로 써야 할지 막막합니다." },
  { i: "github", t: "GitHub 링크만 나열하면 매력이 잘 보이지 않음", d: "링크만으로는 프로젝트의 임팩트와 역할이 전달되지 않습니다." },
  { i: "palette", t: "디자인 구성이 막막함", d: "좋은 컨텐츠가 있어도 시각적으로 정돈되지 않으면 약해 보입니다." },
  { i: "layers", t: "기술스택과 담당 역할이 정리되지 않음", d: "무엇을 어떻게 사용했는지 명확히 보여야 신뢰가 생깁니다." }];

  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="WHY COFOLIO"
        title={<>포트폴리오, 만들기보다 <span className="text-grad">정리가 더 어렵습니다.</span></>}
        sub="좋은 프로젝트를 만들었어도, 제대로 설명하지 못하면 매력이 전달되지 않습니다. Cofolio는 흩어진 프로젝트 정보를 보기 좋은 포트폴리오로 정리해줍니다." />
      
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) =>
        <div key={i} className="reveal glass lift rounded-2xl p-5 ring-grad" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/10 text-violet-200 border border-white/10">
              <Ico name={it.i} size={18} />
            </div>
            <div className="mt-4 text-[15px] font-semibold leading-snug">{it.t}</div>
            <div className="mt-2 text-[13px] text-slate-400 leading-relaxed">{it.d}</div>
          </div>
        )}
      </div>
    </Section>);

};

const Features = () => {
  const items = [
  { i: "sparkles", t: "AI 프로젝트 설명 생성", d: "입력한 프로젝트 내용을 기반으로 문제, 해결 과정, 기술적 성과를 보기 좋게 정리합니다.", tone: "violet" },
  { i: "layers", t: "기술스택 자동 정리", d: "사용한 기술을 Frontend, Backend, AI, Database, Deploy 등으로 자동 분류합니다.", tone: "cyan" },
  { i: "palette", t: "포트폴리오 템플릿 선택", d: "개발자, 디자이너, 학생, 취업 준비생에게 맞는 템플릿을 제공합니다.", tone: "indigo" },
  { i: "github", t: "GitHub 프로젝트 카드", d: "GitHub 링크를 보기 좋은 프로젝트 카드로 변환합니다.", tone: "violet" },
  { i: "wand", t: "자기소개/경력 문장 개선", d: "밋밋한 자기소개를 더 전문적이고 자연스러운 문장으로 다듬습니다.", tone: "cyan" },
  { i: "msg", t: "면접 질문 자동 생성", d: "프로젝트 내용을 기반으로 예상 면접 질문과 답변 포인트를 생성합니다.", tone: "indigo" }];

  return (
    <Section id="features" className="py-24">
      <SectionHeading
        eyebrow="FEATURES"
        title={<>AI가 포트폴리오 제작 과정을 <span className="text-grad">함께 도와줍니다.</span></>}
        sub="단순한 템플릿 제공이 아닌, 글쓰기·구조·디자인까지 함께 다듬는 AI 코파일럿입니다." />
      
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) =>
        <div key={i} className="reveal group relative glass lift rounded-2xl p-6 overflow-hidden" style={{ transitionDelay: `${i * 50}ms` }}>
            <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl group-hover:bg-violet-500/20"></div>
            <div className={cls("grid h-11 w-11 place-items-center rounded-xl border border-white/10",
          it.tone === "violet" ? "bg-violet-500/15 text-violet-200" : it.tone === "cyan" ? "bg-cyan-500/15 text-cyan-200" : "bg-indigo-500/15 text-indigo-200")}>
              <Ico name={it.i} size={20} />
            </div>
            <div className="mt-5 text-[17px] font-semibold tracking-tight">{it.t}</div>
            <div className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{it.d}</div>
            <div className="mt-5 flex items-center gap-1.5 text-[12px] text-violet-300/80 opacity-0 transition group-hover:opacity-100">
              자세히 보기 <Ico name="arrow" size={12} />
            </div>
          </div>
        )}
      </div>
    </Section>);

};

window.Nav = Nav;
window.Hero = Hero;
window.Problem = Problem;
window.Features = Features;