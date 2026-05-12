# CoFolio

> AI 기반 포트폴리오 빌더 SaaS 프로토타입

CoFolio는 학생, 취업 준비생, 주니어 개발자가 자신의 프로젝트 경험을 더 쉽게 정리하고 포트폴리오 형태로 구성할 수 있도록 돕는 웹서비스 프로젝트입니다.

현재 단계의 목표는 완성된 백엔드 서비스가 아니라, **AI 포트폴리오 빌더 SaaS의 프론트엔드 디자인과 사용자 흐름을 먼저 설계하는 것**입니다. 이후 React + TypeScript 또는 Next.js + TypeScript 기반으로 실제 기능을 구현할 예정입니다.

---

## 프로젝트 개요

포트폴리오를 처음 작성하는 사용자는 보통 다음과 같은 문제를 겪습니다.

- 프로젝트 설명을 어떻게 구조화해야 할지 모름
- 기술스택을 단순 나열만 하고 실제 역할과 연결하지 못함
- 문제 해결 과정, 성과, 배운 점을 구체적으로 작성하지 못함
- README, 발표 자료, 포트폴리오 문서가 따로 흩어져 있음
- 결과물이 취업용 포트폴리오로 충분한지 판단하기 어려움

CoFolio는 사용자가 프로젝트 정보, 기술스택, GitHub 링크, 배포 링크, 목표 직무 등을 입력하면 AI가 포트폴리오 구성에 필요한 내용을 분석하고, 개선 방향을 제안하며, 보기 좋은 포트폴리오 페이지로 정리하는 서비스를 목표로 합니다.

---

## 핵심 컨셉

**프로젝트 입력 → AI 분석 → 포트폴리오 생성 → 결과 미리보기 → Export / Publish**

CoFolio는 단순한 개인 포트폴리오 사이트가 아니라, 사용자가 여러 프로젝트를 입력하고 AI의 도움을 받아 포트폴리오 결과물을 만들어내는 **포트폴리오 제작 도구**입니다.

---

## 주요 기능

### 1. 랜딩페이지

서비스의 목적과 핵심 기능을 소개하는 SaaS 스타일 랜딩페이지입니다.

- 서비스 소개
- 주요 기능 설명
- Before / After 비교
- 포트폴리오 생성 흐름 안내
- 템플릿 미리보기
- FAQ

### 2. 포트폴리오 빌더

사용자가 포트폴리오에 들어갈 기본 정보를 입력하는 화면입니다.

- 이름 / 소개 입력
- 목표 직무 입력
- 기술스택 입력
- 프로젝트 정보 입력
- GitHub / 배포 링크 입력
- 템플릿 선택

### 3. AI 포트폴리오 분석

입력된 프로젝트 설명을 바탕으로 포트폴리오 품질을 분석합니다.

분석 예시:

- 설명이 너무 추상적인지
- 기술스택이 실제 역할과 연결되어 있는지
- 문제 해결 과정이 드러나는지
- 성과나 결과가 구체적인지
- README 품질이 충분한지
- 배포 링크 또는 GitHub 링크가 누락되었는지
- 목표 직무와의 적합도가 높은지

### 4. 결과 미리보기

AI 분석 결과와 입력 정보를 바탕으로 생성된 포트폴리오 화면을 미리 확인합니다.

- 포트폴리오 페이지 미리보기
- 프로젝트 카드 확인
- 기술스택 섹션 확인
- 자기소개 / 프로젝트 설명 확인
- 템플릿별 결과 확인

### 5. Export / Publish

생성된 포트폴리오를 외부로 공유하거나 파일로 내보내는 기능입니다.

추후 구현 후보:

- 공개 링크 생성
- Markdown Export
- HTML Export
- PDF Export
- GitHub Pages / Vercel 배포 연동

---

## 현재 진행 상태

현재 CoFolio는 **프론트 디자인 프로토타입 단계**입니다.

확보된 화면 초안:

- 랜딩페이지
- 네비게이션
- Hero 섹션
- 기능 소개 섹션
- Before / After 섹션
- Workflow 섹션
- 템플릿 미리보기
- 포트폴리오 점수 분석 섹션
- 쇼케이스
- FAQ
- 로그인 화면 목업
- 포트폴리오 생성 Builder
- 생성 중 화면
- 결과 페이지
- 대시보드 목업
- 테마 토글
- Export 모달

아직 구현되지 않은 항목:

- 실제 로그인 / 회원가입
- 실제 DB 저장
- 실제 AI 분석
- 실제 포트폴리오 생성
- 실제 PDF / HTML Export
- 실제 결제 기능

---

## 예상 기술 스택

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui 또는 자체 컴포넌트
- Framer Motion

### Backend / Infra

- Next.js API Routes 또는 Server Actions
- Supabase
- PostgreSQL
- Prisma 또는 Supabase Client
- Vercel

### AI

- OpenAI API 또는 Claude API
- 포트폴리오 분석 프롬프트
- 프로젝트 설명 개선 프롬프트
- 직무별 포트폴리오 피드백 프롬프트

---

## TypeScript 개발 원칙

CoFolio의 실제 구현 단계에서는 모든 프론트엔드 코드를 TypeScript 기반으로 작성합니다.

- `.js` 파일 사용 지양
- `.jsx` 파일 사용 지양
- React 컴포넌트는 `.tsx`로 작성
- 일반 유틸 함수와 목업 데이터는 `.ts`로 작성
- `any` 타입은 가능한 한 사용하지 않음
- `Portfolio`, `Project`, `AnalysisResult`, `User`, `ExportOption` 등의 타입을 먼저 정의
- Claude Design에서 생성한 JSX는 최종 코드가 아니라 디자인 참고용으로만 사용
- 실제 개발 시 TSX 컴포넌트 구조로 재정리

---

## MVP 범위

1차 MVP에서는 모든 기능을 완성하지 않고, 포트폴리오 빌더의 핵심 흐름만 구현합니다.

### MVP에 포함할 기능

- 랜딩페이지
- 포트폴리오 입력 폼
- 프로젝트 정보 입력
- 템플릿 선택
- 결과 미리보기 화면
- 목업 기반 AI 분석 결과 표시
- Vercel 배포

### MVP에서 제외할 기능

- 실제 결제
- 복잡한 템플릿 마켓
- 실제 PDF Export
- GitHub 자동 분석
- 다중 사용자 협업
- 완성형 AI 에이전트 기능

---

## 개발 로드맵

### Phase 1. 프론트 디자인 정리

- Claude Design 결과물 분석
- 화면 구조 확정
- 섹션 단위 컴포넌트 분리
- TSX 컴포넌트 구조 설계

### Phase 2. 프론트 프로토타입 구현

- Next.js + TypeScript 프로젝트 구성
- 랜딩페이지 구현
- 빌더 화면 구현
- 결과 화면 구현
- 대시보드 목업 구현
- Vercel 배포

### Phase 3. 최소 백엔드 구현

- 회원가입 / 로그인
- 사용자별 포트폴리오 저장
- 프로젝트 CRUD
- Supabase 연동

### Phase 4. AI 분석 기능 구현

- 입력값 기반 포트폴리오 분석
- 개선 제안 생성
- 분석 점수 표시
- 분석 결과 저장

### Phase 5. Export / Publish 기능 구현

- 공개 링크 생성
- Markdown Export
- PDF Export
- 템플릿별 결과물 생성

---

## 프로젝트 구조 예시

```txt
cofolio/
├── app/
│   ├── page.tsx
│   ├── builder/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── result/
│       └── page.tsx
├── components/
│   ├── common/
│   ├── landing/
│   ├── builder/
│   ├── dashboard/
│   └── portfolio/
├── data/
│   └── mock.ts
├── lib/
│   ├── utils.ts
│   └── ai.ts
├── types/
│   └── index.ts
└── README.md
```

---

## 데이터 구조 초안

```ts
export type Project = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  techStack: string[];
  role: string;
  githubUrl?: string;
  deployUrl?: string;
  result?: string;
  learned?: string;
};

export type Portfolio = {
  id: string;
  ownerName: string;
  targetRole: string;
  introduction: string;
  techStack: string[];
  projects: Project[];
  template: string;
};

export type AnalysisResult = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};
```

---

## 포트폴리오 포인트

CoFolio는 다음 역량을 보여줄 수 있는 프로젝트입니다.

- SaaS형 웹서비스 기획
- React / Next.js 기반 프론트엔드 설계
- TypeScript 기반 컴포넌트 구조화
- 사용자 입력 폼과 결과 화면 설계
- AI API 연동 구조 설계
- Supabase 기반 인증 / DB 연동 확장 가능성
- Vercel 배포 경험
- 포트폴리오 / README / 발표자료로 전환 가능한 결과물 제작

---

## 향후 확장 아이디어

- GitHub 저장소 자동 분석
- README 품질 점수화
- Vercel 배포 링크 자동 연결
- 프로젝트 제작 기록을 포트폴리오 설명으로 변환
- 직무별 포트폴리오 템플릿 추천
- AI 면접 답변 생성
- Notion Export
- GitHub Pages 배포 자동화

---

## 프로젝트 상태

현재 상태: **프론트엔드 디자인 프로토타입 / MVP 설계 단계**

본 프로젝트는 학습 및 포트폴리오 제작을 목적으로 진행 중입니다.
