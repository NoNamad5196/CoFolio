// Generating + Result + Dashboard pages

const STEPS_AI = [
  { l: "프로젝트 정보 분석 중", d: "입력한 데이터에서 핵심 키워드 추출" },
  { l: "기술스택 자동 분류 중", d: "Frontend / Backend / AI 등으로 그룹핑" },
  { l: "프로젝트 설명 다듬는 중", d: "문제 → 해결 → 결과 순으로 재정리" },
  { l: "자기소개 문장 개선 중", d: "전문성과 자연스러움을 균형 있게" },
  { l: "면접 질문 생성 중", d: "프로젝트 기반 예상 질문 8개 생성" },
  { l: "Portfolio Score 계산 중", d: "5개 지표로 완성도 측정" },
];

const GeneratingPage = () => {
  const [progress, setProgress] = React.useState(0);
  const [stepIdx, setStepIdx] = React.useState(0);
  const total = STEPS_AI.length;

  React.useEffect(() => {
    const totalMs = 4500;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = Math.min(1, (now - t0) / totalMs);
      setProgress(elapsed);
      setStepIdx(Math.min(total - 1, Math.floor(elapsed * total)));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => navigate(ROUTES.RESULT), 400);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet"></div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30"></div>
      <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]"></div>

      <div className="w-full max-w-[760px] reveal in">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[12px] text-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse"></span> AI 생성 중
          </div>
          <h1 className="mt-5 text-[32px] sm:text-[40px] font-bold tracking-tight">포트폴리오를 <span className="text-grad">만들고 있어요</span></h1>
          <p className="mt-3 text-[13.5px] text-slate-400">잠시만 기다려 주세요. 평균 5초 정도 걸려요.</p>
        </div>

        <div className="mt-8 glass-strong rounded-2xl p-6 ring-grad">
          {/* progress bar */}
          <div className="flex items-end justify-between mb-2">
            <div className="text-[13px] font-semibold text-slate-200">진행 상황</div>
            <div className="text-[13px] font-mono text-cyan-300">{pct}%</div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 transition-[width] duration-150" style={{ width: `${pct}%` }}></div>
          </div>

          {/* checklist */}
          <div className="mt-6 space-y-2.5">
            {STEPS_AI.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div key={s.l} className={cls("flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition",
                  done ? "border-emerald-400/20 bg-emerald-500/[0.04]" :
                  active ? "border-violet-400/30 bg-violet-500/[0.06]" :
                  "border-white/8 bg-white/[0.02]")}>
                  <div className={cls("mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0",
                    done ? "bg-emerald-500/25 text-emerald-200" :
                    active ? "bg-violet-500/25 text-violet-100" :
                    "bg-white/5 text-slate-500")}>
                    {done ? <Ico name="check" size={11}/> :
                     active ? <span className="h-2 w-2 rounded-full bg-violet-300 anim-pulse"></span> :
                     <span className="text-[10px]">{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cls("text-[13px] font-medium", done ? "text-slate-300" : active ? "text-white" : "text-slate-500")}>{s.l}</div>
                    <div className="text-[11.5px] text-slate-500">{s.d}</div>
                  </div>
                  {active && <div className="text-[11px] text-violet-300 font-mono">처리 중…</div>}
                  {done && <div className="text-[11px] text-emerald-300">완료</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* fake terminal */}
        <div className="mt-5 rounded-xl border border-white/8 bg-ink-950/80 p-3 font-mono text-[11.5px] leading-relaxed text-slate-400 nosb max-h-[120px] overflow-hidden">
          <div><span className="text-violet-300">→</span> cofolio analyze --input ./portfolio.json</div>
          <div><span className="text-cyan-300">✓</span> parsed {Math.floor(progress * 8) + 2} sections</div>
          <div><span className="text-cyan-300">✓</span> classified tech stack into 5 groups</div>
          {progress > 0.5 && <div><span className="text-cyan-300">✓</span> rewrote 12 sentences with --tone professional</div>}
          {progress > 0.75 && <div><span className="text-cyan-300">✓</span> generated 8 interview questions</div>}
          {progress >= 0.99 && <div><span className="text-emerald-300">✓</span> portfolio score: 86/100</div>}
        </div>
      </div>
    </div>
  );
};

// --- Result ---
const ResultPage = () => {
  const { state } = useBuilder();
  const [exportOpen, setExportOpen] = React.useState(false);
  const projects = state.projects?.length ? state.projects : [
    { id: 1, title: "Notewave", desc: "실시간 협업 노트", role: "Frontend Lead", github: "github.com/u/notewave", deploy: "notewave.app" },
    { id: 2, title: "Mealy", desc: "AI 식단 추천", role: "Full-stack", github: "github.com/u/mealy", deploy: "mealy.app" },
  ];
  const allStack = Object.values(state.stack || {}).flat();
  const profile = state.profile?.name ? state.profile : { name: "김지호", role: "Frontend Developer", location: "서울", bio: "협업 도구를 만드는 3년차 프론트엔드" };

  const [copied, setCopied] = React.useState(false);
  const shareUrl = `cofolio.app/p/${(profile.name || "you").toLowerCase().replace(/\s+/g, "-")}`;
  const copy = () => { navigator.clipboard?.writeText("https://" + shareUrl).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-50"></div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5">
          <a href="#/" className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Ico name="logo-c" size={18}/></div><span className="text-[15px] font-bold">Cofolio</span></a>
          <div className="flex items-center gap-2">
            <GhostBtn size="sm" onClick={copy}><Ico name="globe" size={13}/> {copied ? "복사됨!" : "공개 링크"}</GhostBtn>
            <GhostBtn size="sm" onClick={() => navigate(ROUTES.BUILDER)}><Ico name="wand" size={13}/> 수정하기</GhostBtn>
            <GhostBtn size="sm" onClick={() => setExportOpen(true)}><Ico name="download" size={13}/> 내보내기</GhostBtn>
            <PrimaryBtn size="sm" onClick={() => navigate(ROUTES.DASHBOARD)}><Ico name="rocket" size={13}/> 대시보드로</PrimaryBtn>
          </div>
        </div>
      </header>

      <Section className="py-10">
        <div className="mx-auto max-w-[1180px]">
          <div className="reveal in flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <Eyebrow>READY!</Eyebrow>
              <h1 className="mt-3 text-[32px] sm:text-[40px] font-bold tracking-tight">포트폴리오가 <span className="text-grad">완성됐어요</span></h1>
              <p className="mt-2 text-[13.5px] text-slate-400">아래 미리보기를 확인하고 공개하거나 README로 내보낼 수 있습니다.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 h-10 font-mono text-[12px] text-slate-400">
                <Ico name="globe" size={12}/> {shareUrl}
              </div>
              <button onClick={copy} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 h-10 text-[12.5px] text-slate-200 hover:bg-white/[0.06]">
                {copied ? "복사됨!" : "링크 복사"}
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-5">
            {/* portfolio preview */}
            <div className="reveal in glass-strong rounded-2xl overflow-hidden ring-grad glow-violet">
              <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/60">
                <WindowDots/>
                <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
                  <Ico name="globe" size={11}/><span className="font-mono">{shareUrl}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 place-items-center text-white font-bold text-lg ring-grad">
                      {(profile.name || "U").slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[18px] font-semibold">{profile.name || "이름"}</div>
                        <Tag tone="violet">{profile.role || "Developer"}</Tag>
                      </div>
                      <div className="text-[12px] text-slate-400 mt-0.5">{[profile.location, profile.bio].filter(Boolean).join(" · ")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-200"><Ico name="github" size={13}/> GitHub</div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[12px] text-cyan-100"><Ico name="rocket" size={13}/> Deploy</div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[["Projects", projects.length, "violet"], ["Tech Stacks", allStack.length || 12, "indigo"], ["Score", "86", "cyan"]].map(([l, v, c]) => (
                    <div key={l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
                      <div className={cls("mt-1 text-2xl font-bold", c === "violet" ? "text-violet-300" : c === "indigo" ? "text-indigo-300" : "text-cyan-300")}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-[13px] font-semibold text-slate-200">대표 프로젝트</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.slice(0, 4).map((p, i) => (
                    <div key={p.id} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                      <div className={cls("h-12 stripes bg-gradient-to-br", i % 2 ? "from-cyan-500/40 to-blue-500/20" : "from-violet-500/40 to-indigo-500/20")}></div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[13px] font-semibold">{p.title || `Project ${i + 1}`}</div>
                          {p.role && <Tag tone="cyan">{p.role}</Tag>}
                        </div>
                        <div className="mt-1 text-[12px] text-slate-400 leading-relaxed line-clamp-2">{p.desc || "프로젝트 설명"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {allStack.length > 0 && (
                  <>
                    <div className="mt-5 text-[13px] font-semibold text-slate-200">Tech Stack</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {allStack.map((t) => <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] font-mono text-slate-200">{t}</span>)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* sidebar — score + suggestions */}
            <div className="space-y-5">
              <div className="reveal in glass rounded-2xl p-5 text-center">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Portfolio Score</div>
                <div className="mt-3 grid place-items-center"><ScoreRing value={86} size={160}/></div>
                <div className="mt-3 text-[12px] text-emerald-300">상위 12% — 훌륭해요!</div>
              </div>
              <div className="reveal in glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Ico name="sparkles" size={13}/></span>
                  <div className="text-[13px] font-semibold">AI 개선 제안</div>
                </div>
                <div className="space-y-2 text-[12.5px]">
                  {["프로젝트마다 결과 수치를 한 줄 더 추가해보세요.", "배포 링크가 비어있는 프로젝트가 있습니다.", "기술스택을 카테고리별로 분류해보세요."].map((s, i) => (
                    <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-slate-300 leading-relaxed">{s}</div>
                  ))}
                </div>
              </div>
              <div className="reveal in flex flex-col gap-2">
                <PrimaryBtn size="lg" onClick={() => navigate(ROUTES.DASHBOARD)}><Ico name="rocket" size={14}/> 공개하고 대시보드로</PrimaryBtn>
                <GhostBtn onClick={() => navigate(ROUTES.BUILDER)}><Ico name="wand" size={14}/> 다시 수정하기</GhostBtn>
                <button onClick={() => navigate(ROUTES.HOME)} className="text-[12px] text-slate-500 hover:text-slate-300 mt-1">처음으로 돌아가기</button>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} portfolioName={profile.name || "portfolio"}/>
    </div>
  );
};

// --- Dashboard ---
const DashboardPage = () => {
  const { state } = useBuilder();
  const [exportOpen, setExportOpen] = React.useState(false);
  const projectsCount = state.projects?.length || 4;
  const stackCount = Object.values(state.stack || {}).flat().length || 12;
  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-violet opacity-40"></div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between px-5">
          <a href="#/" className="flex items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-lg glass ring-grad"><Ico name="logo-c" size={18}/></div><span className="text-[15px] font-bold">Cofolio</span></a>
          <div className="flex items-center gap-2">
            <GhostBtn size="sm" onClick={() => navigate(ROUTES.RESULT)}><Ico name="eye" size={13}/> 미리보기</GhostBtn>
            <GhostBtn size="sm" onClick={() => setExportOpen(true)}><Ico name="download" size={13}/> 내보내기</GhostBtn>
            <PrimaryBtn size="sm" onClick={() => navigate(ROUTES.BUILDER)}><Ico name="plus" size={13}/> 새 프로젝트</PrimaryBtn>
          </div>
        </div>
      </header>

      <Section className="py-10">
        <div className="reveal in flex items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-[12px] text-slate-500">안녕하세요, {state.profile?.name || "사용자"}님 👋</div>
            <h1 className="mt-1 text-[28px] sm:text-[32px] font-bold tracking-tight">내 포트폴리오 대시보드</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-[12px] text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 anim-pulse"></span> 공개됨 · cofolio.app/p/{(state.profile?.name || "user").toLowerCase().replace(/\s+/g,"-")}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { l: "Portfolio Score", v: "86", c: "violet", icon: "sparkles" },
            { l: "Projects", v: projectsCount, c: "indigo", icon: "folder" },
            { l: "Tech Stacks", v: stackCount, c: "cyan", icon: "layers" },
            { l: "방문자 (7일)", v: "2,432", c: "emerald", icon: "eye" },
          ].map((k) => (
            <div key={k.l} className="reveal in glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{k.l}</div>
                <Ico name={k.icon} size={13} className="text-slate-500"/>
              </div>
              <div className={cls("mt-2 text-[28px] font-bold tracking-tight",
                k.c === "violet" ? "text-violet-300" : k.c === "indigo" ? "text-indigo-300" : k.c === "cyan" ? "text-cyan-300" : "text-emerald-300")}>{k.v}</div>
              <div className="mt-1 text-[11px] text-emerald-400">↑ {Math.floor(Math.random() * 18 + 4)}% 이번 주</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-5">
          <div className="reveal in glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[14px] font-semibold">프로젝트 목록</div>
              <button onClick={() => navigate(ROUTES.BUILDER)} className="inline-flex items-center gap-1.5 text-[12px] text-violet-200 hover:text-violet-100"><Ico name="plus" size={12}/> 추가</button>
            </div>
            <div className="space-y-2">
              {(state.projects?.length ? state.projects : [
                { id: 1, title: "Notewave", desc: "실시간 협업 노트", role: "Frontend Lead" },
                { id: 2, title: "Mealy", desc: "AI 식단 추천", role: "Full-stack" },
                { id: 3, title: "DesignKit", desc: "디자인 시스템 라이브러리", role: "Maintainer" },
              ]).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04]">
                  <div className={cls("h-9 w-9 rounded-lg grid place-items-center text-[12px] font-bold border border-white/10",
                    i % 3 === 0 ? "bg-violet-500/20 text-violet-200" : i % 3 === 1 ? "bg-cyan-500/20 text-cyan-200" : "bg-indigo-500/20 text-indigo-200")}>
                    {(p.title || "P").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{p.title || "프로젝트"}</div>
                    <div className="text-[11.5px] text-slate-400 truncate">{p.desc || "설명"}</div>
                  </div>
                  <Tag tone="emerald">공개</Tag>
                  <button onClick={() => navigate(ROUTES.BUILDER)} className="text-[11.5px] text-slate-400 hover:text-white">편집</button>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal in glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Ico name="sparkles" size={13}/></span>
              <div className="text-[14px] font-semibold">다음 단계</div>
            </div>
            <div className="space-y-2">
              {[
                { l: "포트폴리오 링크 공유하기", a: "링크 복사", action: () => setExportOpen(true) },
                { l: "README로 내보내기", a: "내보내기", action: () => setExportOpen(true) },
                { l: "면접 질문 8개 검토", a: "보기", action: null },
                { l: "커스텀 도메인 연결", a: "Pro 업그레이드", action: null },
              ].map((it, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 flex items-center justify-between gap-3">
                  <div className="text-[12.5px] text-slate-200">{it.l}</div>
                  <button onClick={it.action || (() => {})} className="text-[11.5px] text-violet-200 hover:text-violet-100">{it.a} →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} portfolioName={state.profile?.name || "portfolio"}/>
    </div>
  );
};

window.GeneratingPage = GeneratingPage;
window.ResultPage = ResultPage;
window.DashboardPage = DashboardPage;
