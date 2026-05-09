
export interface ShowcaseProject {
  t: string
  d: string
  tags: string[]
  col: string
  myRole?: string
  problem?: string
  solution?: string
  result?: string
  learned?: string
  github?: string
  deploy?: string
}

export interface ShowcasePreviewStat {
  l: string
  v: string
  c: 'violet' | 'indigo' | 'cyan' | 'emerald'
}

export interface ShowcaseItem {
  id: string
  title: string
  role: string
  themeLabel: string
  d: string
  description: string
  tags: string[]
  techStack: string[]
  thumb: string
  lines: number
  profile: { name: string; initials: string; bio: string }
  previewStats: ShowcasePreviewStat[]
  projects: ShowcaseProject[]
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer Portfolio',
    role: '프론트엔드 개발자',
    themeLabel: '프로젝트 중심',
    d: 'React, TypeScript, Tailwind 기반 프로젝트 중심',
    description: 'React, TypeScript, Tailwind 기반의 웹 프로젝트를 중심으로 구성된 포트폴리오입니다. 컴포넌트 설계와 인터랙션 디테일을 강조합니다.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    techStack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Vite'],
    thumb: 'from-violet-600/40 via-indigo-500/30 to-cyan-500/20',
    lines: 5,
    profile: { name: '김지호', initials: '지', bio: '서울 · 3년차 · UI 시스템 빌더' },
    previewStats: [
      { l: 'Projects', v: '14', c: 'violet' },
      { l: 'Tech Stacks', v: '21', c: 'indigo' },
      { l: 'Views', v: '3.1k', c: 'cyan' },
      { l: 'Score', v: '92', c: 'emerald' },
    ],
    projects: [
      {
        t: 'Cofolio Landing Page',
        d: 'AI 포트폴리오 빌더 SaaS 랜딩 — 모션 디테일에 집중',
        tags: ['React', 'Tailwind', 'Framer'],
        col: 'from-violet-600/40 to-indigo-600/20',
        myRole: '프론트엔드 단독 — 디자인 시스템 수립 및 전체 구현',
        problem: 'AI SaaS 랜딩이 다 비슷해 보여 차별화가 어려웠습니다.',
        solution: '글래스모피즘 + 그라데이션 시스템을 토큰화하고, 모션을 의미 단위로 설계했습니다.',
        result: '방문자 평균 체류 2분 38초, 가입 전환율 4.7%로 벤치마크 대비 1.6배 상승.',
        learned: '장식이 아니라 정보 위계를 강화하는 모션이 전환율에 직접 기여한다는 점을 배웠습니다.',
        github: 'github.com/jiho/cofolio-landing',
        deploy: 'cofolio.app',
      },
      {
        t: 'RushHourCafe Dashboard',
        d: '카페 매출/혼잡도 실시간 대시보드',
        tags: ['Next.js', 'Recharts'],
        col: 'from-cyan-500/40 to-blue-600/20',
        myRole: '프론트엔드 + 차트 데이터 모델링',
        problem: '점주가 실시간 매출/혼잡도를 한눈에 보지 못하던 문제.',
        solution: '30초 폴링 + 가벼운 차트 라이브러리로 핵심 지표만 집중. 다크/라이트 자동 전환.',
        result: '매장 4곳 파일럿 — 피크 타임 의사결정 시간 평균 42% 단축.',
        learned: '차트는 줄이는 게 늘리는 것보다 어렵다는 걸 배웠습니다.',
        github: 'github.com/jiho/rushhour',
        deploy: 'rushhour.demo.app',
      },
      {
        t: 'Interactive UI Components',
        d: '재사용 가능한 모션 컴포넌트 라이브러리',
        tags: ['TS', 'Storybook'],
        col: 'from-fuchsia-500/40 to-violet-600/20',
        myRole: '메인테이너 — 11개 컴포넌트 설계/문서화',
        problem: '팀마다 모션 패턴이 달라 일관성이 떨어졌습니다.',
        solution: '토큰 기반 prop API로 통일하고, Storybook으로 사용 예시를 표준화.',
        result: '사내 3개 팀 도입, 디자인 QA 시간 약 35% 감소.',
        learned: 'API 설계가 곧 디자인 시스템의 정체성이라는 걸 체감했습니다.',
        github: 'github.com/jiho/motion-kit',
        deploy: '',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Engineer Portfolio',
    role: 'AI 엔지니어',
    themeLabel: '리서치 + 구현',
    d: 'RAG, LangChain, Python, Vector DB 프로젝트 중심',
    description: 'RAG, LangChain, Python, Vector DB 프로젝트를 중심으로 구성된 포트폴리오입니다. 데이터 파이프라인과 평가 지표를 함께 다룹니다.',
    tags: ['Python', 'LangChain', 'RAG', 'pgvector'],
    techStack: ['Python', 'LangChain', 'RAG', 'OpenAI API', 'Vector DB', 'FastAPI'],
    thumb: 'from-cyan-500/40 via-blue-500/30 to-indigo-500/20',
    lines: 4,
    profile: { name: '박민준', initials: '민', bio: 'AI Engineer · LLM · RAG · 평가 자동화' },
    previewStats: [
      { l: 'Projects', v: '9', c: 'violet' },
      { l: 'Tech Stacks', v: '14', c: 'indigo' },
      { l: 'Views', v: '1.8k', c: 'cyan' },
      { l: 'Score', v: '88', c: 'emerald' },
    ],
    projects: [
      {
        t: 'Lecture RAG Assistant',
        d: '강의 자료 기반 질의응답 — 평균 답변 정확도 91%',
        tags: ['LangChain', 'pgvector'],
        col: 'from-cyan-500/40 to-blue-600/20',
        myRole: 'AI 엔지니어 단독 — 데이터 파이프라인부터 평가 자동화까지',
        problem: '강의가 늘수록 학생들이 같은 질문을 반복해서 조교가 과부하 상태였습니다.',
        solution: '강의록을 청크 단위로 임베딩하고 pgvector로 검색, 평가셋 200문항으로 자동 회귀 테스트.',
        result: '평균 답변 정확도 91%, 조교 응답 대기 시간 평균 68% 감소.',
        learned: 'RAG는 모델보다 데이터 정제와 평가 루프가 90%였습니다.',
        github: 'github.com/minjun/lecture-rag',
        deploy: 'lecture-rag.demo',
      },
      {
        t: 'Resume Q&A Chatbot',
        d: '이력서 컨텍스트 기반 면접 시뮬레이터',
        tags: ['FastAPI', 'OpenAI'],
        col: 'from-indigo-500/40 to-violet-600/20',
        myRole: '백엔드 + LLM 프롬프트 설계',
        problem: '면접 연습 도구가 일반적인 질문만 던져 실제 도움이 안 됐습니다.',
        solution: '이력서 내용을 컨텍스트로 주입하고 STAR 프레임워크 기반 질문 생성기 구축.',
        result: '베타 사용자 142명, 면접 자신감 평균 +1.8점 (5점 척도).',
        learned: '프롬프트 엔지니어링도 일종의 UX 설계라는 점을 배웠습니다.',
        github: 'github.com/minjun/resume-qa',
        deploy: '',
      },
      {
        t: 'AI Document Summarizer',
        d: '긴 문서를 핵심 위주로 요약해주는 도구',
        tags: ['Python', 'RAG'],
        col: 'from-violet-500/40 to-cyan-600/20',
        myRole: '단독 사이드 프로젝트',
        problem: '긴 PDF 보고서를 요점만 파악하기 어려웠습니다.',
        solution: '맵-리듀스 요약 + 핵심 인용구 추출. 사용자가 길이를 슬라이더로 조절.',
        result: 'GitHub Stars 230+, 주간 활성 사용자 약 800명.',
        learned: '오픈소스로 풀어 놓는 게 가장 빠른 사용자 피드백 루프였습니다.',
        github: 'github.com/minjun/doc-sum',
        deploy: 'doc-sum.dev',
      },
    ],
  },
  {
    id: 'designer',
    title: 'Product Designer Portfolio',
    role: '프로덕트 디자이너',
    themeLabel: '케이스 스터디',
    d: 'UI/UX 케이스 스터디와 디자인 시스템 중심',
    description: 'UI/UX 케이스 스터디와 디자인 시스템을 중심으로 구성된 포트폴리오입니다. 문제 정의부터 검증까지의 흐름을 보여줍니다.',
    tags: ['Figma', 'Design System', 'UX', 'Prototype'],
    techStack: ['Figma', 'Design System', 'UX Research', 'Prototyping', 'UI Design'],
    thumb: 'from-fuchsia-500/40 via-violet-500/30 to-pink-500/20',
    lines: 3,
    profile: { name: '이서연', initials: '서', bio: 'Product Designer · Fintech · SaaS' },
    previewStats: [
      { l: 'Projects', v: '11', c: 'violet' },
      { l: 'Tech Stacks', v: '8', c: 'indigo' },
      { l: 'Views', v: '2.6k', c: 'cyan' },
      { l: 'Score', v: '90', c: 'emerald' },
    ],
    projects: [
      {
        t: 'Mobile Banking Redesign',
        d: '사용성 개선으로 핵심 동선 클릭 수 32% 감소',
        tags: ['Figma', 'UX'],
        col: 'from-fuchsia-500/40 to-violet-600/20',
        myRole: '리드 디자이너 — 리서치부터 핸드오프까지',
        problem: '송금 화면이 6단계로 분산되어 이탈률이 높았습니다.',
        solution: '사용자 인터뷰 12명 진행 후 동선을 3단계로 재설계, 빈도 높은 액션을 상단에 고정.',
        result: '핵심 동선 클릭 수 32% 감소, 송금 완료율 +18%p.',
        learned: '단계를 줄이는 것보다 단계를 의미 있게 묶는 게 더 중요했습니다.',
        github: '',
        deploy: 'figma.com/proto/banking-redesign',
      },
      {
        t: 'SaaS Dashboard UX Case Study',
        d: '복잡한 데이터를 정보 위계로 재정리한 케이스',
        tags: ['UX', 'Prototype'],
        col: 'from-violet-500/40 to-pink-500/20',
        myRole: '단독 케이스 스터디',
        problem: '지표 30개가 같은 비중으로 나열돼 무엇이 중요한지 불분명했습니다.',
        solution: 'F-패턴 기반 위계 재구성 + 점진 공개(progressive disclosure) 패턴 적용.',
        result: '프로토타입 사용성 테스트 SUS 점수 79점.',
        learned: '정보 위계는 디자인이 아니라 의사결정의 문제라는 걸 배웠습니다.',
        github: '',
        deploy: 'figma.com/proto/saas-dashboard',
      },
      {
        t: 'Design System Kit',
        d: '토큰 기반 컴포넌트 시스템 · 14개 팀 도입',
        tags: ['Design System'],
        col: 'from-pink-500/40 to-violet-600/20',
        myRole: '디자인 시스템 오너',
        problem: '팀마다 컴포넌트가 달라 디자인-개발 합의에 시간이 너무 오래 걸렸습니다.',
        solution: '디자인 토큰 표준화 + Figma Variables 도입, 코드 사이드와 1:1 매핑.',
        result: '14개 팀 도입, 디자인 QA 평균 38% 단축.',
        learned: '시스템은 만드는 것보다 유지·전파가 90%입니다.',
        github: '',
        deploy: 'design.cofolio.app/system',
      },
    ],
  },
  {
    id: 'student',
    title: 'Student Project Portfolio',
    role: '대학생 프로젝트 포트폴리오',
    themeLabel: '학업 + 활동',
    d: '수업 프로젝트, 공모전, 캡스톤, 활동 경험 중심',
    description: '수업 프로젝트, 공모전, 캡스톤, 사이드 프로젝트를 균형 있게 보여주는 포트폴리오입니다.',
    tags: ['Capstone', 'Hackathon', 'TeamProject', 'Activity'],
    techStack: ['Java', 'Python', 'React', 'MySQL', 'Spring Boot', 'GitHub'],
    thumb: 'from-indigo-500/40 via-violet-500/30 to-emerald-500/20',
    lines: 5,
    profile: { name: '오하늘', initials: '하', bio: '컴퓨터공학과 4학년 · 캡스톤 + 동아리 활동' },
    previewStats: [
      { l: 'Projects', v: '8', c: 'violet' },
      { l: 'Tech Stacks', v: '12', c: 'indigo' },
      { l: 'Views', v: '940', c: 'cyan' },
      { l: 'Score', v: '84', c: 'emerald' },
    ],
    projects: [
      {
        t: 'Capstone AI Service',
        d: '캡스톤 — 강의 추천 AI · 교내 우수상 수상',
        tags: ['Python', 'Spring Boot'],
        col: 'from-indigo-500/40 to-emerald-500/20',
        myRole: '팀 리더 (4인) — 백엔드 + 추천 모델',
        problem: '수강신청 때 학생들이 본인 적성에 맞는 강의를 찾기 어려웠습니다.',
        solution: '재학생 평점 데이터 + 협업 필터링 추천 모델 구현, Spring Boot로 API 서빙.',
        result: '교내 우수상 수상, 베타 700명 사용자, 평균 만족도 4.3/5.',
        learned: '모델 정확도보다 학생들이 결과를 신뢰할 수 있게 설명해주는 UI가 더 중요했습니다.',
        github: 'github.com/haneul/capstone-ai',
        deploy: 'capstone.school.demo',
      },
      {
        t: 'Algorithm Visualizer',
        d: '정렬/탐색 알고리즘 단계별 시각화 도구',
        tags: ['React', 'TS'],
        col: 'from-violet-500/40 to-indigo-600/20',
        myRole: '단독 사이드 프로젝트',
        problem: '알고리즘 수업에서 단계별 동작이 머릿속으로 잘 그려지지 않았습니다.',
        solution: '각 단계를 React state로 관리하고 속도 슬라이더로 흐름을 직접 따라가게 구현.',
        result: '교내 학습 도구로 채택, 개강 첫 주 방문자 1.4k명.',
        learned: '내가 잘 이해하지 못한 개념일수록 좋은 시각화를 만들 수 있다는 걸 배웠습니다.',
        github: 'github.com/haneul/algo-vis',
        deploy: 'algo-vis.demo',
      },
      {
        t: 'Campus Event App',
        d: '교내 행사 알림 모바일 앱 · MAU 1.2k',
        tags: ['Java', 'MySQL'],
        col: 'from-emerald-500/40 to-cyan-500/20',
        myRole: '백엔드 + DB 설계',
        problem: '교내 행사 정보가 여러 채널에 흩어져 있어 놓치는 학생이 많았습니다.',
        solution: '학과별 알림 구독 모델 설계, 푸시 알림 + 캘린더 연동.',
        result: 'MAU 1.2k, 행사 참여율 학과 평균 +24%.',
        learned: '기능보다 알림 정책 설계가 사용자 신뢰를 좌우했습니다.',
        github: 'github.com/haneul/campus-event',
        deploy: '',
      },
    ],
  },
]
