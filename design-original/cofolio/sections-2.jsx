// Sections 2: Before/After, Workflow, Templates, Dashboard

const BeforeAfter = () => {
  const before = [
    "정리되지 않은 프로젝트 설명",
    "단순한 GitHub 링크 나열",
    "밋밋한 README",
    "기술스택과 역할 설명 부족",
    "채용 담당자가 보기 어려운 구성",
  ];
  const after = [
    "명확한 문제 해결 과정",
    "보기 좋은 프로젝트 카드",
    "기술스택과 담당 역할 정리",
    "면접에서 설명하기 쉬운 구조",
    "채용 담당자가 빠르게 이해할 수 있는 포트폴리오",
  ];
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="BEFORE / AFTER"
        title={<>흩어진 프로젝트를 <span className="text-grad">설득력 있는 포트폴리오로.</span></>}
        sub="같은 프로젝트도 정리 방식에 따라 전혀 다르게 보입니다."
      />
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE */}
        <div className="reveal relative rounded-2xl border border-white/8 bg-ink-900/40 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(80%_40%_at_50%_0%,rgba(120,120,140,0.08),transparent_70%)]"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/15 text-rose-300 border border-rose-400/20"><Ico name="x" size={14}/></span>
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-400">Before</div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">portfolio_v0.txt</div>
          </div>

          <div className="mt-5 space-y-3 font-mono text-[12.5px]">
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500">
              <div className="text-slate-400">프로젝트 1</div>
              <div className="opacity-70">- 그냥 만들었음. 리액트 사용함.</div>
              <div className="opacity-70">- github.com/user/proj-a</div>
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500">
              <div className="opacity-70">- proj-b: 팀 프로젝트, 백엔드 담당</div>
              <div className="opacity-70">- github.com/user/proj-b</div>
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 text-slate-500 opacity-70">
              <div>기술: react, ts, mysql, aws, figma, ...</div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {before.map(b => (
              <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-400">
                <Ico name="x" size={14} className="mt-1 text-rose-400/80"/> {b}
              </li>
            ))}
          </ul>
        </div>

        {/* AFTER */}
        <div className="reveal relative rounded-2xl ring-grad bg-gradient-to-br from-ink-800/70 to-ink-900/70 p-6 overflow-hidden glow-violet">
          <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(124,58,237,0.18),transparent_70%)]"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"><Ico name="check" size={14}/></span>
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-violet-200">After</div>
            </div>
            <Tag tone="violet">Cofolio 정리본</Tag>
          </div>

          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Notewave · 실시간 협업 노트</div>
                <Tag tone="cyan">Frontend Lead</Tag>
              </div>
              <div className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">
                동시 편집 충돌을 줄이기 위해 OT 알고리즘을 적용해 평균 응답 지연을 <span className="text-cyan-300">120ms → 38ms</span>로 단축.
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["React","TypeScript","WebSocket","Yjs"].map(t => <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-200">{t}</span>)}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Mealy · AI 식단 추천</div>
                <Tag tone="indigo">Backend</Tag>
              </div>
              <div className="mt-1.5 text-[12px] text-slate-300 leading-relaxed">
                벡터 검색 기반 추천 시스템으로 사용자 만족도 <span className="text-cyan-300">+27%</span>, 일일 활성 사용자 <span className="text-cyan-300">2.1k</span> 달성.
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {["Next.js","FastAPI","pgvector","OpenAI"].map(t => <span key={t} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-200">{t}</span>)}
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {after.map(b => (
              <li key={b} className="flex items-start gap-2 text-[13.5px] text-slate-200">
                <Ico name="check" size={14} className="mt-1 text-emerald-400"/> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

const Workflow = () => {
  const steps = [
    { n:"01", t:"프로젝트 정보 입력", d:"프로젝트 설명, 기술스택, GitHub 링크, 배포 링크를 입력합니다.", i:"file"},
    { n:"02", t:"AI가 구조와 문장을 정리", d:"Cofolio가 프로젝트의 핵심 가치와 기술적 포인트를 자동으로 정리합니다.", i:"sparkles"},
    { n:"03", t:"포트폴리오 생성 및 공유", d:"완성된 포트폴리오를 웹사이트로 공유하거나 README 형태로 내보낼 수 있습니다.", i:"rocket"},
  ];
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="HOW IT WORKS"
        title={<><span className="text-grad">3단계로</span> 포트폴리오를 완성하세요.</>}
        sub="입력 → 정리 → 공유. 그게 전부입니다."
      />
      <div className="relative mt-14">
        {/* connecting line */}
        <div aria-hidden className="absolute left-0 right-0 top-[44px] hidden lg:block h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="reveal relative" style={{transitionDelay:`${i*80}ms`}}>
              <div className="glass rounded-2xl p-6 lift">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-white border border-white/15">
                    <Ico name={s.i} size={20}/>
                  </div>
                  <div className="font-mono text-[28px] text-grad-sub font-bold">{s.n}</div>
                </div>
                <div className="mt-5 text-[18px] font-semibold tracking-tight">{s.t}</div>
                <div className="mt-2 text-[13.5px] text-slate-400 leading-relaxed">{s.d}</div>

                {/* mini visual per step */}
                <div className="mt-5 rounded-xl border border-white/8 bg-ink-900/60 p-3">
                  {i === 0 && (
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-500">project_name <span className="text-violet-300">Notewave</span></div>
                      <div className="flex justify-between text-slate-500">stack <span className="text-cyan-300">React, TS, WS</span></div>
                      <div className="flex justify-between text-slate-500">github <span className="text-slate-300">/user/notewave</span></div>
                      <div className="flex justify-between text-slate-500">deploy <span className="text-slate-300">notewave.app</span></div>
                    </div>
                  )}
                  {i === 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px]"><span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse"></span><span className="text-slate-300">문장 다듬는 중…</span></div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-violet-400 to-cyan-400"></div></div>
                      <div className="flex items-center gap-2 text-[11px]"><Ico name="check" size={11} className="text-emerald-400"/><span className="text-slate-400">기술스택 자동 분류</span></div>
                      <div className="flex items-center gap-2 text-[11px]"><Ico name="check" size={11} className="text-emerald-400"/><span className="text-slate-400">README 요약</span></div>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 rounded-md bg-white/[0.03] px-2 py-1.5 font-mono text-[10.5px] text-slate-400">cofolio.app/p/kim-oo</div>
                      <button className="rounded-md bg-violet-500/20 px-2 py-1.5 text-[11px] text-violet-100 border border-violet-400/30">공개하기</button>
                    </div>
                  )}
                </div>
              </div>
              {/* arrow connector */}
              {i < 2 && (
                <div className="absolute right-[-14px] top-[44px] hidden lg:flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 border border-violet-400/30 text-violet-300 z-10">
                  <Ico name="arrow" size={12}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Templates = () => {
  const [selected, setSelected] = React.useState(null);
  const items = [
    {
      t:"Developer", d:"개발자 프로젝트와 기술스택을 강조하는 템플릿",
      tags:["GitHub 연동","코드 카드","기술 그래프"], tone:"violet",
      preview: (
        <div className="space-y-2">
          <div className="h-3 w-1/2 rounded bg-white/15"></div>
          <div className="h-2 w-2/3 rounded bg-white/8"></div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <div className="h-12 rounded bg-gradient-to-br from-violet-500/40 to-indigo-500/10"></div>
            <div className="h-12 rounded bg-gradient-to-br from-cyan-500/30 to-blue-500/10"></div>
          </div>
          <div className="flex gap-1 mt-1">
            <div className="h-1.5 w-8 rounded bg-violet-400/50"></div>
            <div className="h-1.5 w-6 rounded bg-cyan-400/50"></div>
            <div className="h-1.5 w-10 rounded bg-indigo-400/50"></div>
          </div>
        </div>
      ),
    },
    {
      t:"Designer", d:"비주얼 작업물과 케이스 스터디를 강조하는 템플릿",
      tags:["대형 썸네일","케이스 스터디","무드보드"], tone:"cyan",
      preview: (
        <div className="space-y-2">
          <div className="h-16 rounded bg-gradient-to-br from-fuchsia-500/40 via-violet-500/30 to-cyan-500/30"></div>
          <div className="grid grid-cols-3 gap-1">
            <div className="h-7 rounded bg-white/10"></div>
            <div className="h-7 rounded bg-white/8"></div>
            <div className="h-7 rounded bg-white/12"></div>
          </div>
          <div className="h-2 w-1/3 rounded bg-white/15"></div>
        </div>
      ),
    },
    {
      t:"Student", d:"학업, 프로젝트, 공모전, 활동 경험을 균형 있게 보여주는 템플릿",
      tags:["타임라인","수상 이력","활동 카드"], tone:"indigo",
      preview: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-indigo-400/40"></div>
            <div className="space-y-1 flex-1">
              <div className="h-2 w-2/3 rounded bg-white/15"></div>
              <div className="h-1.5 w-1/2 rounded bg-white/8"></div>
            </div>
          </div>
          <div className="border-l border-violet-400/30 pl-2 space-y-1.5">
            <div className="h-1.5 w-3/4 rounded bg-white/10"></div>
            <div className="h-1.5 w-2/3 rounded bg-white/8"></div>
            <div className="h-1.5 w-1/2 rounded bg-white/8"></div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Section id="templates" className="py-24">
      <SectionHeading
        eyebrow="TEMPLATES"
        title={<>나에게 맞는 <span className="text-grad">포트폴리오 템플릿</span>을 선택하세요.</>}
        sub="역할과 목적에 따라 구조와 강조점이 다른 템플릿을 제공합니다."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <div key={it.t} className="reveal group glass lift rounded-2xl overflow-hidden" style={{transitionDelay:`${i*70}ms`}}>
            <div className="relative h-44 overflow-hidden border-b border-white/8 bg-ink-900/60">
              <div className="absolute inset-0 bg-grid opacity-30"></div>
              <div className="absolute inset-x-3 top-3">
                <div className="rounded-lg bg-ink-800/80 backdrop-blur p-3 transition-transform group-hover:-translate-y-1">
                  {it.preview}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-900 to-transparent"></div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-[16px] font-semibold tracking-tight">{it.t}</div>
                <Tag tone={it.tone}>{it.tone === "violet" ? "개발자" : it.tone === "cyan" ? "디자이너" : "학생"}</Tag>
              </div>
              <div className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">{it.d}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {it.tags.map(t => <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-slate-300">{t}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => setSelected(it.t)} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-[12px] text-violet-100 hover:bg-violet-500/20">
                  <Ico name="eye" size={12}/> 미리보기
                </button>
                <Ico name="arrow" size={14} className="text-slate-500 group-hover:text-violet-300 transition"/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TemplatePreviewModal template={selected} onClose={() => setSelected(null)} />
    </Section>
  );
};

const Dashboard = () => {
  const stack = [
    {l:"Frontend", v:42, c:"#a78bfa"},
    {l:"Backend", v:24, c:"#6366f1"},
    {l:"AI", v:18, c:"#22d3ee"},
    {l:"Database", v:10, c:"#60a5fa"},
    {l:"Deploy", v:6, c:"#34d399"},
  ];
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="APP PREVIEW"
        title={<>포트폴리오 제작 과정을 <span className="text-grad">한눈에 관리하세요.</span></>}
        sub="프로젝트 정리부터 공개까지, Cofolio 대시보드에서 모두 처리됩니다."
      />

      <div className="reveal mt-14 rounded-[20px] glass-strong overflow-hidden glow-violet ring-grad">
        {/* app top bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-ink-900/60">
          <div className="flex items-center gap-3">
            <WindowDots/>
            <div className="ml-2 flex items-center gap-2 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 font-mono">
              <Ico name="logo-c" size={11}/> cofolio.app/dashboard
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11.5px] text-slate-200">
              <Ico name="download" size={12}/> README 내보내기
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-3 py-1.5 text-[11.5px] text-white font-semibold">
              <Ico name="rocket" size={12}/> 공개하기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr] min-h-[640px]">
          {/* sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 border-r border-white/5 bg-ink-900/40 p-3">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Workspace</div>
            {[
              ["overview","대시보드","chart",true],
              ["projects","프로젝트","folder",false],
              ["stack","기술스택","layers",false],
              ["templates","템플릿","palette",false],
              ["score","Portfolio Score","sparkles",false],
              ["share","공유 / 배포","rocket",false],
            ].map(([k,l,i,active]) => (
              <button key={k} className={cls("flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]",
                active ? "bg-violet-500/15 text-violet-100 border border-violet-400/20" : "text-slate-300 hover:bg-white/5")}>
                <Ico name={i} size={14}/> {l}
              </button>
            ))}
            <div className="mt-auto rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="text-[11px] text-slate-400">Pro 플랜 7일 남음</div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-violet-400 to-cyan-400"></div>
              </div>
              <button className="mt-2 w-full rounded-md bg-white/5 hover:bg-white/10 text-[11px] py-1.5">업그레이드</button>
            </div>
          </aside>

          {/* main */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-slate-500">안녕하세요, 김지호님</div>
                <div className="text-[20px] font-semibold tracking-tight">포트폴리오 작업실</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 h-9 text-[12px] text-slate-400">
                  <Ico name="search" size={12}/> 프로젝트 검색
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg btn-primary px-3 h-9 text-[12px] font-semibold text-white">
                  <Ico name="plus" size={12}/> 새 프로젝트
                </button>
              </div>
            </div>

            {/* top row: score + stack chart + visitors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* portfolio score mini */}
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <ScoreRing value={86} size={120} label="PORTFOLIO SCORE"/>
                <div className="flex-1">
                  <div className="text-[12px] text-slate-400">Recently edited</div>
                  <div className="text-[14px] font-semibold mt-0.5">Notewave · 협업 노트</div>
                  <div className="mt-3 space-y-1.5 text-[11px]">
                    {[["설명",92],["스택",88],["링크",76]].map(([l,v]) => (
                      <div key={l} className="flex items-center gap-2">
                        <div className="w-12 text-slate-400">{l}</div>
                        <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{width:`${v}%`}}></div></div>
                        <div className="w-8 text-right text-slate-300 font-mono">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* tech stack distribution */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold">기술스택 분포</div>
                  <Tag tone="slate">최근 30일</Tag>
                </div>
                <div className="mt-4 space-y-2">
                  {stack.map(s => (
                    <div key={s.l} className="flex items-center gap-3">
                      <div className="w-16 text-[11.5px] text-slate-300">{s.l}</div>
                      <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${s.v*2}%`, background:`linear-gradient(90deg, ${s.c}, ${s.c}aa)`}}></div>
                      </div>
                      <div className="w-9 text-right text-[11px] font-mono text-slate-300">{s.v}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* visitor stats */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold">방문자 통계</div>
                  <div className="text-[11px] text-emerald-400 inline-flex items-center gap-1"><Ico name="zap" size={11}/> +18%</div>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <div className="text-[28px] font-bold">2,432</div>
                  <div className="text-[11px] text-slate-500">최근 7일</div>
                </div>
                <div className="mt-2"><SparkArea values={[12,18,14,22,26,20,32,28,38,42,36,48]} color="#22d3ee" width={260} height={70}/></div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">검색</div><div className="text-slate-200 font-semibold">42%</div></div>
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">직접</div><div className="text-slate-200 font-semibold">31%</div></div>
                  <div className="rounded bg-white/5 px-2 py-1"><div className="text-slate-500">SNS</div><div className="text-slate-200 font-semibold">27%</div></div>
                </div>
              </div>
            </div>

            {/* projects + AI panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-4">
              {/* project list */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] font-semibold">프로젝트 목록</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500"><Ico name="folder" size={11}/> 12 projects</div>
                </div>
                <div className="space-y-2">
                  {[
                    {n:"Notewave", d:"실시간 협업 노트", s:92, tags:["React","TS","WS"], status:"공개"},
                    {n:"Mealy", d:"AI 식단 추천", s:88, tags:["Next.js","FastAPI"], status:"공개"},
                    {n:"DesignKit", d:"디자인 시스템 라이브러리", s:81, tags:["TS","Storybook"], status:"임시저장"},
                    {n:"Trailmap", d:"등산 코스 추천", s:74, tags:["React Native"], status:"임시저장"},
                  ].map((p,i) => (
                    <div key={p.n} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5 hover:bg-white/[0.04]">
                      <div className={cls("h-9 w-9 rounded-lg grid place-items-center text-[12px] font-bold border border-white/10",
                        i%3===0?"bg-violet-500/20 text-violet-200":i%3===1?"bg-cyan-500/20 text-cyan-200":"bg-indigo-500/20 text-indigo-200")}>
                        {p.n.slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-[13px] font-semibold truncate">{p.n}</div>
                          <span className={cls("rounded-full px-1.5 py-0.5 text-[10px] border",
                            p.status==="공개"?"text-emerald-300 bg-emerald-500/10 border-emerald-400/30":"text-slate-300 bg-white/5 border-white/10")}>{p.status}</span>
                        </div>
                        <div className="text-[11.5px] text-slate-400 truncate">{p.d}</div>
                      </div>
                      <div className="hidden sm:flex flex-wrap gap-1">
                        {p.tags.map(t => <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{t}</span>)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] text-slate-400">Score</div>
                        <div className="font-mono text-[12.5px] text-violet-200 font-semibold">{p.s}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI suggestions */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Ico name="sparkles" size={13}/></span>
                    <div className="text-[13px] font-semibold">AI 개선 제안</div>
                  </div>
                  <Tag tone="violet">3</Tag>
                </div>
                <div className="space-y-2.5">
                  {[
                    {t:"Mealy 프로젝트에 배포 링크가 없습니다.", a:"링크 추가", tone:"violet"},
                    {t:"Notewave의 ‘담당 역할’ 한 줄 추가를 제안합니다.", a:"문장 생성", tone:"cyan"},
                    {t:"기술스택을 카테고리별로 그룹핑해보세요.", a:"자동 정리", tone:"indigo"},
                  ].map((s,i) => (
                    <div key={i} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <div className="text-[12.5px] text-slate-200 leading-relaxed">{s.t}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">방금 전</div>
                        <button className={cls("rounded-md px-2.5 py-1 text-[11px] border",
                          s.tone==="violet"?"bg-violet-500/15 text-violet-100 border-violet-400/30":
                          s.tone==="cyan"?"bg-cyan-500/15 text-cyan-100 border-cyan-400/30":
                          "bg-indigo-500/15 text-indigo-100 border-indigo-400/30")}>{s.a}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

window.BeforeAfter = BeforeAfter;
window.Workflow = Workflow;
window.Templates = Templates;
window.Dashboard = Dashboard;
