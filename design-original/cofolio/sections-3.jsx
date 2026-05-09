// Sections 3: Portfolio Score, Showcase, Pricing, FAQ, CTA, Footer

const PortfolioScore = () => {
  const metrics = [
    {l:"프로젝트 설명 명확도", v:92, c:"#a78bfa"},
    {l:"기술스택 정리도", v:88, c:"#818cf8"},
    {l:"링크 완성도", v:76, c:"#f472b6"},
    {l:"디자인 일관성", v:84, c:"#22d3ee"},
    {l:"채용 담당자 관점 가독성", v:90, c:"#34d399"},
  ];
  const suggestions = [
    "프로젝트마다 문제 해결 과정을 한 줄 더 추가해보세요.",
    "배포 링크가 없는 프로젝트는 GitHub 링크만으로는 약해 보일 수 있습니다.",
    "기술스택을 Frontend, Backend, AI, Deploy로 나누면 더 읽기 쉽습니다.",
  ];
  return (
    <Section className="py-24">
      <SectionHeading
        eyebrow="PORTFOLIO SCORE"
        title={<>포트폴리오 완성도를 <span className="text-grad">AI가 분석합니다.</span></>}
        sub="Cofolio는 포트폴리오의 구성, 설명, 기술스택, 링크, 가독성을 분석해 더 설득력 있는 포트폴리오가 되도록 개선 포인트를 제안합니다."
      />
      <div className="reveal mt-14 grid grid-cols-1 lg:grid-cols-[420px,1fr] gap-5">
        {/* Score card */}
        <div className="glass-strong rounded-2xl p-6 ring-grad glow-violet">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold tracking-tight">Overall Score</div>
            <Tag tone="violet">실시간 분석</Tag>
          </div>
          <div className="mt-5 grid place-items-center">
            <ScoreRing value={86} size={208} label="PORTFOLIO SCORE" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[["Top","12%","violet"],["랭크","Lv.4","cyan"],["성장","+8%","indigo"]].map(([l,v,c]) => (
              <div key={l} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{l}</div>
                <div className={cls("mt-1 text-[16px] font-bold", c==="violet"?"text-violet-300":c==="cyan"?"text-cyan-300":"text-indigo-300")}>{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mb-2">완성 체크리스트</div>
            <div className="space-y-1.5 text-[12.5px]">
              {[
                ["프로필 정보 입력", true],
                ["프로젝트 3개 이상", true],
                ["기술스택 카테고리 분류", true],
                ["배포 링크 추가", false],
                ["면접 질문 검토", false],
              ].map(([l, ok]) => (
                <div key={l} className="flex items-center gap-2">
                  {ok
                    ? <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/20 text-emerald-300"><Ico name="check" size={10}/></span>
                    : <span className="grid h-4 w-4 place-items-center rounded-full bg-white/5 text-slate-500 border border-white/10"><Ico name="plus" size={10}/></span>}
                  <span className={ok ? "text-slate-200" : "text-slate-500"}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* metrics + AI */}
        <div className="space-y-5">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold">세부 지표</div>
              <div className="text-[11px] text-slate-500 font-mono">scored 5분 전</div>
            </div>
            <div className="mt-5 space-y-4">
              {metrics.map(m => (
                <div key={m.l}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <div className="text-slate-300">{m.l}</div>
                    <div className="font-mono text-slate-200">{m.v}%</div>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${m.v}%`, background:`linear-gradient(90deg, ${m.c}, ${m.c}88)`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-200 border border-violet-400/20"><Ico name="sparkles" size={13}/></span>
              <div className="text-[14px] font-semibold">AI 개선 제안</div>
              <Tag tone="cyan">3 actions</Tag>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {suggestions.map((s, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-violet-300/80">Suggestion {i+1}</div>
                  <div className="mt-2 text-[12.5px] text-slate-200 leading-relaxed">{s}</div>
                  <button className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-violet-200 hover:text-violet-100">적용하기 <Ico name="arrow" size={11}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const SHOWCASE_ITEMS = [
  {
    id: "frontend",
    title: "Frontend Developer Portfolio",
    role: "프론트엔드 개발자",
    themeLabel: "프로젝트 중심",
    d: "React, TypeScript, Tailwind 기반 프로젝트 중심",
    description: "React, TypeScript, Tailwind 기반의 웹 프로젝트를 중심으로 구성된 포트폴리오입니다. 컴포넌트 설계와 인터랙션 디테일을 강조합니다.",
    tags: ["React", "TypeScript", "Tailwind", "Next.js"],
    techStack: ["React", "TypeScript", "Tailwind", "Framer Motion", "Vite"],
    thumb: "from-violet-600/40 via-indigo-500/30 to-cyan-500/20",
    lines: 5,
    profile: { name: "김지호", initials: "지", bio: "서울 · 3년차 · UI 시스템 빌더" },
    previewStats: [
      { l: "Projects", v: "14", c: "violet" },
      { l: "Tech Stacks", v: "21", c: "indigo" },
      { l: "Views", v: "3.1k", c: "cyan" },
      { l: "Score", v: "92", c: "emerald" },
    ],
    projects: [
      { t: "Cofolio Landing Page", d: "AI 포트폴리오 빌더 SaaS 랜딩 — 모션 디테일에 집중", tags: ["React", "Tailwind", "Framer"], col: "from-violet-600/40 to-indigo-600/20",
        myRole: "프론트엔드 단독 — 디자인 시스템 수립 및 전체 구현",
        problem: "AI SaaS 랜딩이 다 비슷해 보여 차별화가 어려웠습니다.",
        solution: "글래스모피즘 + 그라데이션 시스템을 토큰화하고, 모션을 의미 단위로 설계했습니다.",
        result: "방문자 평균 체류 2분 38초, 가입 전환율 4.7%로 벤치마크 대비 1.6배 상승.",
        learned: "장식이 아니라 정보 위계를 강화하는 모션이 전환율에 직접 기여한다는 점을 배웠습니다.",
        github: "github.com/jiho/cofolio-landing", deploy: "cofolio.app" },
      { t: "RushHourCafe Dashboard", d: "카페 매출/혼잡도 실시간 대시보드", tags: ["Next.js", "Recharts"], col: "from-cyan-500/40 to-blue-600/20",
        myRole: "프론트엔드 + 차트 데이터 모델링", problem: "점주가 실시간 매출/혼잡도를 한눈에 보지 못하던 문제.",
        solution: "30초 폴링 + 가벼운 차트 라이브러리로 핵심 지표만 집중. 다크/라이트 자동 전환.",
        result: "매장 4곳 파일럿 — 피크 타임 의사결정 시간 평균 42% 단축.",
        learned: "차트는 줄이는 게 늘리는 것보다 어렵다는 걸 배웠습니다.",
        github: "github.com/jiho/rushhour", deploy: "rushhour.demo.app" },
      { t: "Interactive UI Components", d: "재사용 가능한 모션 컴포넌트 라이브러리", tags: ["TS", "Storybook"], col: "from-fuchsia-500/40 to-violet-600/20",
        myRole: "메인테이너 — 11개 컴포넌트 설계/문서화", problem: "팀마다 모션 패턴이 달라 일관성이 떨어졌습니다.",
        solution: "토큰 기반 prop API로 통일하고, Storybook으로 사용 예시를 표준화.",
        result: "사내 3개 팀 도입, 디자인 QA 시간 약 35% 감소.",
        learned: "API 설계가 곧 디자인 시스템의 정체성이라는 걸 체감했습니다.",
        github: "github.com/jiho/motion-kit", deploy: "" },
    ],
  },
  {
    id: "ai",
    title: "AI Engineer Portfolio",
    role: "AI 엔지니어",
    themeLabel: "리서치 + 구현",
    d: "RAG, LangChain, Python, Vector DB 프로젝트 중심",
    description: "RAG, LangChain, Python, Vector DB 프로젝트를 중심으로 구성된 포트폴리오입니다. 데이터 파이프라인과 평가 지표를 함께 다룹니다.",
    tags: ["Python", "LangChain", "RAG", "pgvector"],
    techStack: ["Python", "LangChain", "RAG", "OpenAI API", "Vector DB", "FastAPI"],
    thumb: "from-cyan-500/40 via-blue-500/30 to-indigo-500/20",
    lines: 4,
    profile: { name: "박민준", initials: "민", bio: "AI Engineer · LLM · RAG · 평가 자동화" },
    previewStats: [
      { l: "Projects", v: "9", c: "violet" },
      { l: "Tech Stacks", v: "14", c: "indigo" },
      { l: "Views", v: "1.8k", c: "cyan" },
      { l: "Score", v: "88", c: "emerald" },
    ],
    projects: [
      { t: "Lecture RAG Assistant", d: "강의 자료 기반 질의응답 — 평균 답변 정확도 91%", tags: ["LangChain", "pgvector"], col: "from-cyan-500/40 to-blue-600/20",
        myRole: "AI 엔지니어 단독 — 데이터 파이프라인부터 평가 자동화까지",
        problem: "강의가 늘수록 학생들이 같은 질문을 반복해서 조교가 과부하 상태였습니다.",
        solution: "강의록을 청크 단위로 임베딩하고 pgvector로 검색, 평가셋 200문항으로 자동 회귀 테스트.",
        result: "평균 답변 정확도 91%, 조교 응답 대기 시간 평균 68% 감소.",
        learned: "RAG는 모델보다 데이터 정제와 평가 루프가 90%였습니다.",
        github: "github.com/minjun/lecture-rag", deploy: "lecture-rag.demo" },
      { t: "Resume Q&A Chatbot", d: "이력서 컨텍스트 기반 면접 시뮬레이터", tags: ["FastAPI", "OpenAI"], col: "from-indigo-500/40 to-violet-600/20",
        myRole: "백엔드 + LLM 프롬프트 설계", problem: "면접 연습 도구가 일반적인 질문만 던져 실제 도움이 안 됐습니다.",
        solution: "이력서 내용을 컨텍스트로 주입하고 STAR 프레임워크 기반 질문 생성기 구축.",
        result: "베타 사용자 142명, 면접 자신감 평균 +1.8점 (5점 척도).",
        learned: "프롬프트 엔지니어링도 일종의 UX 설계라는 점을 배웠습니다.",
        github: "github.com/minjun/resume-qa", deploy: "" },
      { t: "AI Document Summarizer", d: "긴 문서를 핵심 위주로 요약해주는 도구", tags: ["Python", "RAG"], col: "from-violet-500/40 to-cyan-600/20",
        myRole: "단독 사이드 프로젝트", problem: "긴 PDF 보고서를 요점만 파악하기 어려웠습니다.",
        solution: "맵-리듀스 요약 + 핵심 인용구 추출. 사용자가 길이를 슬라이더로 조절.",
        result: "GitHub Stars 230+, 주간 활성 사용자 약 800명.",
        learned: "오픈소스로 풀어 놓는 게 가장 빠른 사용자 피드백 루프였습니다.",
        github: "github.com/minjun/doc-sum", deploy: "doc-sum.dev" },
    ],
  },
  {
    id: "designer",
    title: "Product Designer Portfolio",
    role: "프로덕트 디자이너",
    themeLabel: "케이스 스터디",
    d: "UI/UX 케이스 스터디와 디자인 시스템 중심",
    description: "UI/UX 케이스 스터디와 디자인 시스템을 중심으로 구성된 포트폴리오입니다. 문제 정의부터 검증까지의 흐름을 보여줍니다.",
    tags: ["Figma", "Design System", "UX", "Prototype"],
    techStack: ["Figma", "Design System", "UX Research", "Prototyping", "UI Design"],
    thumb: "from-fuchsia-500/40 via-violet-500/30 to-pink-500/20",
    lines: 3,
    profile: { name: "이서연", initials: "서", bio: "Product Designer · Fintech · SaaS" },
    previewStats: [
      { l: "Projects", v: "11", c: "violet" },
      { l: "Tech Stacks", v: "8", c: "indigo" },
      { l: "Views", v: "2.6k", c: "cyan" },
      { l: "Score", v: "90", c: "emerald" },
    ],
    projects: [
      { t: "Mobile Banking Redesign", d: "사용성 개선으로 핵심 동선 클릭 수 32% 감소", tags: ["Figma", "UX"], col: "from-fuchsia-500/40 to-violet-600/20",
        myRole: "리드 디자이너 — 리서치부터 핸드오프까지", problem: "송금 화면이 6단계로 분산되어 이탈률이 높았습니다.",
        solution: "사용자 인터뷰 12명 진행 후 동선을 3단계로 재설계, 빈도 높은 액션을 상단에 고정.",
        result: "핵심 동선 클릭 수 32% 감소, 송금 완료율 +18%p.",
        learned: "단계를 줄이는 것보다 단계를 의미 있게 묶는 게 더 중요했습니다.",
        github: "", deploy: "figma.com/proto/banking-redesign" },
      { t: "SaaS Dashboard UX Case Study", d: "복잡한 데이터를 정보 위계로 재정리한 케이스", tags: ["UX", "Prototype"], col: "from-violet-500/40 to-pink-500/20",
        myRole: "단독 케이스 스터디", problem: "지표 30개가 같은 비중으로 나열돼 무엇이 중요한지 불분명했습니다.",
        solution: "F-패턴 기반 위계 재구성 + 점진 공개(progressive disclosure) 패턴 적용.",
        result: "프로토타입 사용성 테스트 SUS 점수 79점.",
        learned: "정보 위계는 디자인이 아니라 의사결정의 문제라는 걸 배웠습니다.",
        github: "", deploy: "figma.com/proto/saas-dashboard" },
      { t: "Design System Kit", d: "토큰 기반 컴포넌트 시스템 · 14개 팀 도입", tags: ["Design System"], col: "from-pink-500/40 to-violet-600/20",
        myRole: "디자인 시스템 오너", problem: "팀마다 컴포넌트가 달라 디자인-개발 합의에 시간이 너무 오래 걸렸습니다.",
        solution: "디자인 토큰 표준화 + Figma Variables 도입, 코드 사이드와 1:1 매핑.",
        result: "14개 팀 도입, 디자인 QA 평균 38% 단축.",
        learned: "시스템은 만드는 것보다 유지·전파가 90%입니다.",
        github: "", deploy: "design.cofolio.app/system" },
    ],
  },
  {
    id: "student",
    title: "Student Project Portfolio",
    role: "대학생 프로젝트 포트폴리오",
    themeLabel: "학업 + 활동",
    d: "수업 프로젝트, 공모전, 캡스톤, 활동 경험 중심",
    description: "수업 프로젝트, 공모전, 캡스톤, 사이드 프로젝트를 균형 있게 보여주는 포트폴리오입니다.",
    tags: ["Capstone", "Hackathon", "TeamProject", "Activity"],
    techStack: ["Java", "Python", "React", "MySQL", "Spring Boot", "GitHub"],
    thumb: "from-indigo-500/40 via-violet-500/30 to-emerald-500/20",
    lines: 5,
    profile: { name: "오하늘", initials: "하", bio: "컴퓨터공학과 4학년 · 캡스톤 + 동아리 활동" },
    previewStats: [
      { l: "Projects", v: "8", c: "violet" },
      { l: "Tech Stacks", v: "12", c: "indigo" },
      { l: "Views", v: "940", c: "cyan" },
      { l: "Score", v: "84", c: "emerald" },
    ],
    projects: [
      { t: "Capstone AI Service", d: "캡스톤 — 강의 추천 AI · 교내 우수상 수상", tags: ["Python", "Spring Boot"], col: "from-indigo-500/40 to-emerald-500/20",
        myRole: "팀 리더 (4인) — 백엔드 + 추천 모델", problem: "수강신청 때 학생들이 본인 적성에 맞는 강의를 찾기 어려웠습니다.",
        solution: "재학생 평점 데이터 + 협업 필터링 추천 모델 구현, Spring Boot로 API 서빙.",
        result: "교내 우수상 수상, 베타 700명 사용자, 평균 만족도 4.3/5.",
        learned: "모델 정확도보다 학생들이 결과를 신뢰할 수 있게 설명해주는 UI가 더 중요했습니다.",
        github: "github.com/haneul/capstone-ai", deploy: "capstone.school.demo" },
      { t: "Algorithm Visualizer", d: "정렬/탐색 알고리즘 단계별 시각화 도구", tags: ["React", "TS"], col: "from-violet-500/40 to-indigo-600/20",
        myRole: "단독 사이드 프로젝트", problem: "알고리즘 수업에서 단계별 동작이 머릿속으로 잘 그려지지 않았습니다.",
        solution: "각 단계를 React state로 관리하고 속도 슬라이더로 흐름을 직접 따라가게 구현.",
        result: "교내 학습 도구로 채택, 개강 첫 주 방문자 1.4k명.",
        learned: "내가 잘 이해하지 못한 개념일수록 좋은 시각화를 만들 수 있다는 걸 배웠습니다.",
        github: "github.com/haneul/algo-vis", deploy: "algo-vis.demo" },
      { t: "Campus Event App", d: "교내 행사 알림 모바일 앱 · MAU 1.2k", tags: ["Java", "MySQL"], col: "from-emerald-500/40 to-cyan-500/20",
        myRole: "백엔드 + DB 설계", problem: "교내 행사 정보가 여러 채널에 흩어져 있어 놓치는 학생이 많았습니다.",
        solution: "학과별 알림 구독 모델 설계, 푸시 알림 + 캘린더 연동.",
        result: "MAU 1.2k, 행사 참여율 학과 평균 +24%.",
        learned: "기능보다 알림 정책 설계가 사용자 신뢰를 좌우했습니다.",
        github: "github.com/haneul/campus-event", deploy: "" },
    ],
  },
];

const PortfolioPreviewModal = ({ portfolio, onClose }) => {
  React.useEffect(() => {
    if (!portfolio) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [portfolio, onClose]);

  if (!portfolio) return null;
  const p = portfolio;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.title} 미리보기`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      style={{ animation: "fadeIn .2s ease-out" }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        aria-hidden="true"
      ></div>

      <div
        className="relative w-full max-w-[960px] max-h-[92vh] overflow-hidden rounded-2xl glass-strong ring-grad glow-violet flex flex-col"
        style={{ animation: "popIn .28s cubic-bezier(.2,.7,.2,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 sm:px-7 py-4 bg-ink-900/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag tone="violet">{p.role}</Tag>
              <Tag tone="cyan">{p.themeLabel}</Tag>
            </div>
            <div className="mt-2 text-[18px] sm:text-[20px] font-bold tracking-tight truncate">{p.title}</div>
            <div className="mt-1 text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">{p.description}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="모달 닫기"
            className="shrink-0 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            <Ico name="x" size={16}/>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto nosb p-5 sm:p-7 space-y-5">
          {/* Browser-like preview */}
          <div className="rounded-2xl border border-white/10 bg-ink-900/50 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 bg-ink-900/70">
              <WindowDots />
              <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md bg-white/[0.04] px-2 text-[11px] text-slate-400">
                <Ico name="globe" size={11}/>
                <span className="font-mono truncate">cofolio.app/p/{p.id}</span>
              </div>
            </div>
            <div className={cls("relative px-5 sm:px-6 pt-5 pb-6 bg-gradient-to-br", p.thumb)}>
              <div className="absolute inset-0 bg-grid opacity-25"></div>
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 place-items-center text-white font-bold text-[15px] ring-grad">
                    {p.profile.initials}
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">{p.profile.name}</div>
                    <div className="text-[11.5px] text-slate-300/90">{p.profile.bio}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[12px] text-slate-100 hover:bg-white/[0.1]">
                    <Ico name="github" size={13}/> GitHub
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-500/15 px-3 py-1.5 text-[12px] text-cyan-100 hover:bg-cyan-500/25">
                    <Ico name="rocket" size={13}/> 배포 보기
                  </button>
                </div>
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-t border-white/5">
              {p.previewStats.map((s) => (
                <div key={s.l} className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{s.l}</div>
                  <div className={cls("mt-1 text-[20px] font-bold",
                    s.c === "violet" ? "text-violet-300" :
                    s.c === "indigo" ? "text-indigo-300" :
                    s.c === "cyan" ? "text-cyan-300" : "text-emerald-300")}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="rounded-2xl glass p-5">
            <div className="text-[13px] font-semibold mb-3">Tech Stack</div>
            <div className="flex flex-wrap gap-1.5">
              {p.techStack.map(t => (
                <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[12px] font-mono text-slate-200">{t}</span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-semibold">대표 프로젝트</div>
              <div className="text-[11px] text-slate-500">{p.projects.length}개</div>
            </div>
            <div className="space-y-3">
              {p.projects.map((proj) => (
                <div key={proj.t} className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.02]">
                  <div className={cls("h-12 bg-gradient-to-br stripes", proj.col)}></div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[14px] font-semibold">{proj.t}</div>
                        <div className="flex flex-wrap gap-1">
                          {proj.tags.map(t => <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">{t}</span>)}
                        </div>
                      </div>
                      <div className="text-[12px] text-slate-400 mt-1 leading-relaxed">{proj.d}</div>
                    </div>

                    {(proj.myRole || proj.problem || proj.solution || proj.result || proj.learned) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12px]">
                        {proj.myRole && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-violet-300/80">본인 역할</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.myRole}</div>
                          </div>
                        )}
                        {proj.problem && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-cyan-300/80">문제 상황</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.problem}</div>
                          </div>
                        )}
                        {proj.solution && (
                          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-2.5 sm:col-span-2">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-indigo-300/80">해결 방법</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.solution}</div>
                          </div>
                        )}
                        {proj.result && (
                          <div className="rounded-lg border border-emerald-400/15 bg-emerald-500/[0.04] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">결과</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.result}</div>
                          </div>
                        )}
                        {proj.learned && (
                          <div className="rounded-lg border border-pink-400/15 bg-pink-500/[0.04] p-2.5">
                            <div className="text-[10px] uppercase tracking-[0.14em] text-pink-300/80">배운 점</div>
                            <div className="mt-1 text-slate-200 leading-relaxed">{proj.learned}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {(proj.github || proj.deploy) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {proj.github && (
                          <a href={`https://${proj.github}`} target="_blank" rel="noreferrer"
                             className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] text-slate-200 hover:bg-white/[0.08]">
                            <Ico name="github" size={12}/> GitHub
                          </a>
                        )}
                        {proj.deploy && (
                          <a href={`https://${proj.deploy}`} target="_blank" rel="noreferrer"
                             className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1.5 text-[11.5px] text-cyan-100 hover:bg-cyan-500/20">
                            <Ico name="rocket" size={12}/> 배포
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/8 bg-ink-900/50 px-5 sm:px-7 py-3 flex items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500">미리보기는 Cofolio가 생성하는 결과물 예시입니다.</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">닫기</button>
            <PrimaryBtn size="sm" onClick={() => { onClose(); navigate('/builder'); }}><Ico name="sparkles" size={13}/> 비슷하게 만들기</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

const Showcase = () => {
  const [selected, setSelected] = React.useState(null);
  const items = SHOWCASE_ITEMS;
  return (
    <Section id="showcase" className="py-24">
      <SectionHeading
        eyebrow="SHOWCASE"
        title={<>완성된 포트폴리오는 <span className="text-grad">이렇게 보입니다.</span></>}
        sub="Cofolio가 만들어낸 결과물 예시입니다."
      />
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div key={it.title} className="reveal group glass lift rounded-2xl overflow-hidden" style={{transitionDelay:`${i*60}ms`}}>
            <div className="relative h-48 overflow-hidden border-b border-white/8">
              <div className={cls("absolute inset-0 bg-gradient-to-br", it.thumb)}></div>
              <div className="absolute inset-0 bg-grid opacity-30"></div>
              <div className="absolute inset-3 rounded-lg bg-ink-900/70 backdrop-blur p-3 transition-transform duration-500 group-hover:scale-[1.04]">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span>
                </div>
                <div className="mt-2 h-2.5 w-2/3 rounded bg-white/15"></div>
                <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white/8"></div>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {Array.from({length: it.lines}).map((_, k) => (
                    <div key={k} className="h-7 rounded bg-white/8"></div>
                  ))}
                </div>
                <div className="mt-2 flex gap-1">
                  <div className="h-1.5 w-6 rounded bg-violet-400/60"></div>
                  <div className="h-1.5 w-4 rounded bg-cyan-400/60"></div>
                  <div className="h-1.5 w-8 rounded bg-indigo-400/60"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[14.5px] font-semibold tracking-tight">{it.title}</div>
              <div className="mt-0.5 text-[11.5px] text-violet-300/80">{it.role}</div>
              <div className="mt-2 text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">{it.d}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {it.tags.map(t => <span key={t} className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10.5px] font-mono text-slate-300">{t}</span>)}
              </div>
              <button onClick={() => setSelected(it)} className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-violet-200 hover:text-violet-100">
                포트폴리오 보기 <Ico name="arrow" size={12}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      <PortfolioPreviewModal portfolio={selected} onClose={() => setSelected(null)} />
    </Section>
  );
};

const Pricing = () => {
  const plans = [
    {
      name:"Free", price:"₩0", per:"/월", desc:"가볍게 시작해보세요.",
      features:["포트폴리오 1개","기본 템플릿","프로젝트 카드 3개","기본 AI 문장 개선"],
      cta:"무료로 시작하기", recommended:false, tone:"slate",
    },
    {
      name:"Pro", price:"₩12,900", per:"/월", desc:"제한 없이 성장하세요.",
      features:["포트폴리오 무제한","프리미엄 템플릿","프로젝트 카드 무제한","GitHub 연동","고급 AI 문장 개선","README 내보내기"],
      cta:"Pro 시작하기", recommended:true, tone:"violet",
    },
    {
      name:"Career", price:"₩24,900", per:"/월", desc:"취업 준비에 최적화.",
      features:["자기소개서/이력서 문장 개선","면접 질문 생성","커스텀 도메인","채용용 포트폴리오 분석","우선 지원"],
      cta:"Career 시작하기", recommended:false, tone:"cyan",
    },
  ];
  return (
    <Section id="pricing" className="py-24">
      <SectionHeading
        eyebrow="PRICING"
        title={<>필요한 만큼 시작하고, <span className="text-grad">성장에 맞게 확장하세요.</span></>}
        sub="언제든지 업그레이드하거나 다운그레이드할 수 있습니다."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p, i) => (
          <div key={p.name} className={cls(
            "reveal relative rounded-2xl p-7 lift",
            p.recommended ? "glass-strong ring-grad glow-violet" : "glass"
          )} style={{transitionDelay:`${i*80}ms`}}>
            {p.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                <Ico name="star" size={11}/> 추천
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-bold tracking-tight">{p.name}</div>
              <Tag tone={p.tone}>
                {p.name === "Free" ? "Starter" : p.name === "Pro" ? "Most popular" : "For job seekers"}
              </Tag>
            </div>
            <div className="mt-1 text-[12.5px] text-slate-400">{p.desc}</div>
            <div className="mt-5 flex items-baseline gap-1">
              <div className={cls("text-[36px] font-bold tracking-tight", p.recommended ? "text-grad" : "text-white")}>{p.price}</div>
              <div className="text-[13px] text-slate-500">{p.per}</div>
            </div>
            {p.recommended
              ? <PrimaryBtn className="mt-5 w-full" size="lg" onClick={() => navigate('/builder')}>{p.cta}</PrimaryBtn>
              : <GhostBtn className="mt-5 w-full" size="lg" onClick={() => navigate('/builder')}>{p.cta}</GhostBtn>}
            <div className="mt-6 h-px bg-white/8"></div>
            <ul className="mt-5 space-y-2.5">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-200">
                  <span className={cls("mt-0.5 grid h-4 w-4 place-items-center rounded-full",
                    p.recommended ? "bg-violet-500/25 text-violet-200" : "bg-white/8 text-slate-300")}>
                    <Ico name="check" size={11}/>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-[12px] text-slate-500">모든 플랜은 부가세 별도이며, 학생 인증 시 50% 할인 제공합니다.</div>
    </Section>
  );
};

const FAQ = () => {
  const qa = [
    ["코딩을 몰라도 사용할 수 있나요?", "네, 코딩 지식이 없어도 사용 가능합니다. 프로젝트 설명과 기본 정보만 입력하면 Cofolio AI가 구조와 디자인을 자동으로 정리합니다."],
    ["GitHub 프로젝트를 가져올 수 있나요?", "GitHub 계정을 연결하면 저장소 정보와 README를 자동으로 불러와 포트폴리오 카드 형태로 변환해줍니다."],
    ["포트폴리오를 배포할 수 있나요?", "Cofolio가 제공하는 cofolio.app 서브도메인으로 즉시 배포할 수 있으며, Pro 이상 플랜에서는 커스텀 도메인 연결도 지원합니다."],
    ["무료로 사용할 수 있나요?", "Free 플랜에서는 포트폴리오 1개, 프로젝트 카드 3개, 기본 AI 문장 개선까지 무제한으로 사용할 수 있습니다."],
    ["만든 포트폴리오를 PDF나 README로 내보낼 수 있나요?", "Pro 플랜부터 PDF, README.md, JSON 형식으로 내보내기를 지원합니다. 채용 사이트 첨부용으로도 활용할 수 있습니다."],
    ["커스텀 도메인을 연결할 수 있나요?", "Pro / Career 플랜에서 본인 소유 도메인을 연결할 수 있습니다. CNAME 설정 가이드를 함께 제공해 드립니다."],
    ["학생도 사용할 수 있나요?", "물론입니다. 학교 메일 인증을 통해 모든 유료 플랜을 50% 할인된 가격으로 이용할 수 있습니다."],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <Section id="faq" className="py-24">
      <SectionHeading
        eyebrow="FAQ"
        title={<><span className="text-grad">자주 묻는 질문</span></>}
        sub="더 궁금한 점이 있다면 hello@cofolio.app 으로 문의해주세요."
      />
      <div className="mt-12 mx-auto max-w-3xl reveal">
        <div className="glass rounded-2xl divide-y divide-white/5 overflow-hidden">
          {qa.map(([q,a], i) => {
            const isOpen = open === i;
            return (
              <button key={q} onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full text-left px-5 sm:px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02]">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-200 border border-violet-400/20 font-mono text-[11px]">{String(i+1).padStart(2,"0")}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 text-[15px] font-semibold text-slate-100">{q}</div>
                    <Ico name="chevron-down" size={16} className={cls("mt-1 text-slate-400 transition", isOpen && "rotate-180 text-violet-300")}/>
                  </div>
                  <div className={cls("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <div className="text-[13.5px] text-slate-400 leading-[1.7] pr-2">{a}</div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

const FinalCTA = () => (
  <Section className="py-24">
    <div className="reveal relative overflow-hidden rounded-[28px] glass-strong ring-grad p-10 sm:p-16 text-center">
      <div className="absolute inset-0 -z-0 bg-radial-violet"></div>
      <div className="absolute inset-0 -z-0 bg-grid opacity-30" style={{maskImage:"radial-gradient(70% 60% at 50% 50%, black, transparent)", WebkitMaskImage:"radial-gradient(70% 60% at 50% 50%, black, transparent)"}}></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[640px] rounded-full bg-violet-600/30 blur-3xl"></div>
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-64 w-[640px] rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="relative">
        <Eyebrow>READY?</Eyebrow>
        <h2 className="mt-5 text-[40px] sm:text-[56px] md:text-[64px] font-bold leading-[1.05] tracking-tight">
          이제 프로젝트를 <br className="sm:hidden"/>
          <span className="text-grad">더 잘 보여주세요.</span>
        </h2>
        <p className="mt-5 mx-auto max-w-xl text-[15px] sm:text-[16px] text-slate-300 leading-[1.7]">
          Cofolio로 흩어진 프로젝트를 정리하고, 채용 담당자가 보기 좋은 포트폴리오로 완성하세요.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PrimaryBtn size="lg" onClick={() => navigate('/builder')}><Ico name="sparkles" size={16}/> 무료로 시작하기</PrimaryBtn>
          <GhostBtn size="lg" onClick={() => { document.getElementById('templates')?.scrollIntoView({behavior:'smooth'}); }}><Ico name="layers" size={16}/> 템플릿 둘러보기</GhostBtn>
        </div>
        <div className="mt-6 text-[12px] text-slate-500">신용카드 등록 없이 시작 · 언제든지 취소 가능</div>
      </div>
    </div>
  </Section>
);

const Footer = () => {
  const cols = [
    ["Product", ["기능","템플릿","쇼케이스","요금제","변경 로그"]],
    ["Resources", ["가이드","블로그","고객 사례","개발자 문서","상태 페이지"]],
    ["Company", ["회사 소개","채용","연락처","미디어 키트","파트너십"]],
  ];
  return (
    <footer className="relative border-t border-white/5 mt-12">
      <Section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad"><Ico name="logo-c" size={22}/></div>
              <div className="text-[17px] font-bold tracking-tight">Cofolio</div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] text-slate-400 leading-[1.7]">
              Cofolio는 프로젝트, 기술스택, GitHub 정보를 정리해 채용 담당자가 보기 좋은 포트폴리오로 완성해주는 AI 포트폴리오 빌더입니다.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                {i:"github", l:"GitHub"},
                {i:"globe", l:"Website"},
                {i:"msg", l:"Discord"},
                {i:"share", l:"X"},
              ].map(s => (
                <a key={s.l} aria-label={s.l} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/8 hover:text-white">
                  <Ico name={s.i} size={14}/>
                </a>
              ))}
            </div>
          </div>
          {cols.map(([t, items]) => (
            <div key={t}>
              <div className="text-[12px] uppercase tracking-[0.16em] text-slate-500 mb-3">{t}</div>
              <ul className="space-y-2">
                {items.map(l => <li key={l}><a className="text-[13px] text-slate-300 hover:text-white">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/5 pt-6">
          <div className="text-[12px] text-slate-500">© 2026 Cofolio Inc. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[12px] text-slate-500">
            <a className="hover:text-slate-300">개인정보처리방침</a>
            <a className="hover:text-slate-300">이용약관</a>
            <a className="hover:text-slate-300">쿠키 정책</a>
          </div>
        </div>
      </Section>
    </footer>
  );
};

window.PortfolioScore = PortfolioScore;
window.Showcase = Showcase;
window.Pricing = Pricing;
window.FAQ = FAQ;
window.FinalCTA = FinalCTA;
window.Footer = Footer;
