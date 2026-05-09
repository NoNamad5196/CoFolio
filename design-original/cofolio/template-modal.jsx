// Template Preview Modal — full-page mockup of each template

const TEMPLATE_PREVIEWS = {
  Developer: {
    tone: "violet",
    accent: "from-violet-500 via-indigo-500 to-cyan-500",
    name: "김지호",
    role: "Frontend Developer",
    bio: "협업 도구를 만드는 3년차 프론트엔드 · React · TypeScript",
    location: "서울",
    stats: [["Projects", "12", "violet"], ["Stacks", "18", "indigo"], ["Stars", "248", "cyan"]],
    sections: ["Hero", "Featured Projects", "Tech Stack", "GitHub Activity", "Contact"],
    projects: [
      { t: "Notewave", d: "실시간 협업 노트 — OT 알고리즘으로 충돌 해결", tags: ["React", "WebSocket"], col: "from-violet-600/40 to-indigo-600/20" },
      { t: "Mealy", d: "벡터 검색 기반 AI 식단 추천", tags: ["Next.js", "OpenAI"], col: "from-cyan-500/40 to-blue-600/20" },
      { t: "DesignKit", d: "토큰 기반 디자인 시스템 라이브러리", tags: ["TypeScript", "Storybook"], col: "from-fuchsia-500/40 to-violet-600/20" },
      { t: "MarketPulse", d: "실시간 시세 대시보드", tags: ["WebSocket", "D3"], col: "from-emerald-500/40 to-cyan-500/20" },
    ],
    stack: ["React", "TypeScript", "Next.js", "Tailwind", "Node.js", "GraphQL", "PostgreSQL", "Prisma", "Redis", "Docker", "Vercel", "GitHub Actions"],
  },
  Designer: {
    tone: "cyan",
    accent: "from-fuchsia-500 via-violet-500 to-cyan-500",
    name: "이서연",
    role: "Product Designer",
    bio: "사용자의 흐름을 시각적으로 풀어내는 5년차 프로덕트 디자이너",
    location: "서울 · Remote",
    stats: [["Case Studies", "9", "violet"], ["Awards", "4", "cyan"], ["Years", "5", "indigo"]],
    sections: ["Hero", "Selected Works", "Case Study", "Process", "Recognition"],
    projects: [
      { t: "Linkmind Onboarding", d: "B2B SaaS 첫 인상 재설계 — Conversion +38%", tags: ["UX", "Onboarding"], col: "from-fuchsia-500/50 to-violet-500/20" },
      { t: "Habito Brand System", d: "운동 습관 앱의 풀 리브랜딩 + 디자인 시스템", tags: ["Branding", "DS"], col: "from-cyan-500/50 to-blue-500/20" },
      { t: "Marketo Editor", d: "마케터를 위한 노코드 에디터 IA 정리", tags: ["IA", "Tooling"], col: "from-amber-500/50 to-rose-500/20" },
      { t: "Casefile", d: "법률 자문 케이스 정리 도구", tags: ["Web", "B2B"], col: "from-emerald-500/40 to-teal-500/20" },
    ],
    stack: ["Figma", "Framer", "Webflow", "Protopie", "After Effects", "Photoshop", "Illustrator", "Notion", "Miro"],
  },
  Student: {
    tone: "indigo",
    accent: "from-indigo-500 via-violet-500 to-cyan-500",
    name: "박민준",
    role: "Computer Science Student",
    bio: "데이터와 AI에 관심 많은 컴퓨터공학과 4학년",
    location: "대전 · KAIST",
    stats: [["Projects", "6", "violet"], ["Awards", "3", "cyan"], ["GPA", "4.1", "indigo"]],
    sections: ["About", "Education", "Activities", "Projects", "Awards", "Skills"],
    projects: [
      { t: "졸업작품 — RAG 검색", d: "사내 문서 기반 검색 시스템 (학과 우수상)", tags: ["LangChain", "FastAPI"], col: "from-indigo-500/50 to-violet-500/20" },
      { t: "교내 해커톤 우승작", d: "캠퍼스 분실물 매칭 앱 — 24시간 개발", tags: ["React Native", "Firebase"], col: "from-violet-500/40 to-fuchsia-500/20" },
      { t: "공모전 — 공공데이터", d: "교통 사고 예측 모델 시각화", tags: ["Python", "Streamlit"], col: "from-cyan-500/40 to-blue-500/20" },
    ],
    stack: ["Python", "PyTorch", "TensorFlow", "JavaScript", "React", "FastAPI", "PostgreSQL", "Git"],
    timeline: [
      { y: "2024", t: "교내 SW 해커톤 대상" },
      { y: "2023", t: "오픈소스 컨트리뷰톤 참가" },
      { y: "2023", t: "AI 학회 부원 활동" },
      { y: "2022", t: "정보처리기사 취득" },
    ],
  },
};

const TemplatePreviewModal = ({ template, onClose }) => {
  React.useEffect(() => {
    if (!template) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [template, onClose]);

  if (!template) return null;
  const t = TEMPLATE_PREVIEWS[template];
  if (!t) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" style={{animation:"fadeIn .2s ease"}}>
      <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-[1080px] max-h-[92vh] glass-strong rounded-2xl ring-grad overflow-hidden flex flex-col" style={{animation:"popIn .3s cubic-bezier(.2,.8,.2,1)"}}>
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-3 bg-ink-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <WindowDots/>
            <div className="ml-2 flex items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11.5px] text-slate-400 font-mono"><Ico name="globe" size={11}/> cofolio.app/templates/{template.toLowerCase()}</div>
          </div>
          <div className="flex items-center gap-2">
            <Tag tone={t.tone}>{template} 템플릿</Tag>
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-slate-300 hover:bg-white/[0.08]"><Ico name="x" size={14}/></button>
          </div>
        </div>

        {/* scrollable preview */}
        <div className="flex-1 overflow-y-auto nosb">
          {/* hero */}
          <div className="relative px-7 py-10 border-b border-white/5">
            <div aria-hidden className={cls("absolute inset-0 bg-gradient-to-br opacity-20", t.accent)}></div>
            <div aria-hidden className="absolute inset-0 bg-grid opacity-25"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className={cls("grid h-16 w-16 rounded-2xl bg-gradient-to-br place-items-center text-white font-bold text-xl ring-grad", t.accent)}>
                  {t.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[22px] font-bold tracking-tight">{t.name}</div>
                    <Tag tone={t.tone}>{t.role}</Tag>
                  </div>
                  <div className="mt-1 text-[13px] text-slate-400">{t.location} · {t.bio}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-slate-200"><Ico name="github" size={13}/> GitHub</div>
                <div className={cls("inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px]", t.tone === "cyan" ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-100" : t.tone === "indigo" ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-100" : "border-violet-400/30 bg-violet-500/10 text-violet-100")}><Ico name="rocket" size={13}/> Live</div>
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-3 gap-3">
              {t.stats.map(([l, v, c]) => (
                <div key={l} className="rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur px-3 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
                  <div className={cls("mt-1 text-[24px] font-bold", c === "violet" ? "text-violet-300" : c === "indigo" ? "text-indigo-300" : "text-cyan-300")}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* sections nav */}
          <div className="px-7 py-3 border-b border-white/5 bg-ink-900/40 sticky top-0 z-10 backdrop-blur">
            <div className="flex flex-wrap items-center gap-2 text-[11.5px]">
              {t.sections.map((s, i) => (
                <span key={s} className={cls("rounded-full px-2.5 py-1 border", i === 0 ? "border-violet-400/40 bg-violet-500/15 text-violet-100" : "border-white/8 bg-white/[0.03] text-slate-400")}>{s}</span>
              ))}
            </div>
          </div>

          {/* projects/works */}
          <div className="px-7 py-7">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[15px] font-semibold">{template === "Designer" ? "Selected Works" : template === "Student" ? "Projects & Activities" : "Featured Projects"}</div>
              <div className="text-[11.5px] text-slate-500">{t.projects.length} items</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.projects.map((p, i) => (
                <div key={p.t} className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                  <div className={cls("h-20 stripes bg-gradient-to-br", p.col)}></div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13.5px] font-semibold truncate">{p.t}</div>
                      <Ico name="link" size={12} className="text-slate-500 shrink-0"/>
                    </div>
                    <div className="mt-1 text-[12px] text-slate-400 leading-relaxed">{p.d}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.tags.map((tg) => <span key={tg} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10.5px] text-slate-300 font-mono">{tg}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* stack */}
          <div className="px-7 py-6 border-t border-white/5">
            <div className="text-[15px] font-semibold mb-3">{template === "Designer" ? "Tools" : "Tech Stack"}</div>
            <div className="flex flex-wrap gap-1.5">
              {t.stack.map((s) => <span key={s} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] font-mono text-slate-200">{s}</span>)}
            </div>
          </div>

          {/* student timeline */}
          {template === "Student" && t.timeline && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">Activities & Awards</div>
              <div className="space-y-2">
                {t.timeline.map((it, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                    <div className="mt-0.5 grid h-7 w-12 place-items-center rounded-md bg-indigo-500/15 text-indigo-200 border border-indigo-400/20 font-mono text-[11px]">{it.y}</div>
                    <div className="text-[13px] text-slate-200">{it.t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* designer mood */}
          {template === "Designer" && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">Mood / Direction</div>
              <div className="grid grid-cols-4 gap-2">
                {["from-fuchsia-500/60 to-violet-500/30", "from-cyan-500/60 to-blue-500/30", "from-amber-400/60 to-rose-500/30", "from-emerald-400/60 to-teal-500/30"].map((c, i) => (
                  <div key={i} className={cls("h-20 rounded-xl bg-gradient-to-br", c)}></div>
                ))}
              </div>
            </div>
          )}

          {/* developer github activity */}
          {template === "Developer" && (
            <div className="px-7 py-6 border-t border-white/5">
              <div className="text-[15px] font-semibold mb-3">GitHub Activity</div>
              <div className="grid grid-cols-[repeat(20,1fr)] gap-1">
                {Array.from({ length: 100 }).map((_, i) => {
                  const intensity = Math.random();
                  const c = intensity > 0.85 ? "bg-violet-400/80" : intensity > 0.6 ? "bg-violet-400/50" : intensity > 0.35 ? "bg-violet-400/25" : "bg-white/5";
                  return <div key={i} className={cls("h-3 rounded-sm", c)}></div>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-white/8 bg-ink-900/50 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11.5px] text-slate-500">이 템플릿으로 시작하면 위 구조가 자동으로 적용됩니다.</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">닫기</button>
            <PrimaryBtn size="sm" onClick={() => { onClose(); navigate('/builder'); }}><Ico name="sparkles" size={13}/> 이 템플릿으로 시작</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

window.TemplatePreviewModal = TemplatePreviewModal;
