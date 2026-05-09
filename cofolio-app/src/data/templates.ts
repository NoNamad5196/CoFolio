import type { TagTone, TemplateType } from '../types'

export interface TemplateProject {
  t: string
  d: string
  tags: string[]
  col: string
}

export interface TemplateTimeline {
  y: string
  t: string
}

export interface TemplatePreview {
  tone: TagTone
  accent: string
  name: string
  role: string
  bio: string
  location: string
  stats: [string, string, string][]
  sections: string[]
  projects: TemplateProject[]
  stack: string[]
  timeline?: TemplateTimeline[]
}

export const TEMPLATE_PREVIEWS: Record<TemplateType, TemplatePreview> = {
  developer: {
    tone: 'violet',
    accent: 'from-violet-500 via-indigo-500 to-cyan-500',
    name: '김지호',
    role: 'Frontend Developer',
    bio: '협업 도구를 만드는 3년차 프론트엔드 · React · TypeScript',
    location: '서울',
    stats: [['Projects', '12', 'violet'], ['Stacks', '18', 'indigo'], ['Stars', '248', 'cyan']],
    sections: ['Hero', 'Featured Projects', 'Tech Stack', 'GitHub Activity', 'Contact'],
    projects: [
      { t: 'Notewave', d: '실시간 협업 노트 — OT 알고리즘으로 충돌 해결', tags: ['React', 'WebSocket'], col: 'from-violet-600/40 to-indigo-600/20' },
      { t: 'Mealy', d: '벡터 검색 기반 AI 식단 추천', tags: ['Next.js', 'OpenAI'], col: 'from-cyan-500/40 to-blue-600/20' },
      { t: 'DesignKit', d: '토큰 기반 디자인 시스템 라이브러리', tags: ['TypeScript', 'Storybook'], col: 'from-fuchsia-500/40 to-violet-600/20' },
      { t: 'MarketPulse', d: '실시간 시세 대시보드', tags: ['WebSocket', 'D3'], col: 'from-emerald-500/40 to-cyan-500/20' },
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'GraphQL', 'PostgreSQL', 'Prisma', 'Redis', 'Docker', 'Vercel', 'GitHub Actions'],
  },
  designer: {
    tone: 'cyan',
    accent: 'from-fuchsia-500 via-violet-500 to-cyan-500',
    name: '이서연',
    role: 'Product Designer',
    bio: '사용자의 흐름을 시각적으로 풀어내는 5년차 프로덕트 디자이너',
    location: '서울 · Remote',
    stats: [['Case Studies', '9', 'violet'], ['Awards', '4', 'cyan'], ['Years', '5', 'indigo']],
    sections: ['Hero', 'Selected Works', 'Case Study', 'Process', 'Recognition'],
    projects: [
      { t: 'Linkmind Onboarding', d: 'B2B SaaS 첫 인상 재설계 — Conversion +38%', tags: ['UX', 'Onboarding'], col: 'from-fuchsia-500/50 to-violet-500/20' },
      { t: 'Habito Brand System', d: '운동 습관 앱의 풀 리브랜딩 + 디자인 시스템', tags: ['Branding', 'DS'], col: 'from-cyan-500/50 to-blue-500/20' },
      { t: 'Marketo Editor', d: '마케터를 위한 노코드 에디터 IA 정리', tags: ['IA', 'Tooling'], col: 'from-amber-500/50 to-rose-500/20' },
      { t: 'Casefile', d: '법률 자문 케이스 정리 도구', tags: ['Web', 'B2B'], col: 'from-emerald-500/40 to-teal-500/20' },
    ],
    stack: ['Figma', 'Framer', 'Webflow', 'Protopie', 'After Effects', 'Photoshop', 'Illustrator', 'Notion', 'Miro'],
  },
  student: {
    tone: 'indigo',
    accent: 'from-indigo-500 via-violet-500 to-cyan-500',
    name: '박민준',
    role: 'Computer Science Student',
    bio: '데이터와 AI에 관심 많은 컴퓨터공학과 4학년',
    location: '대전 · KAIST',
    stats: [['Projects', '6', 'violet'], ['Awards', '3', 'cyan'], ['GPA', '4.1', 'indigo']],
    sections: ['About', 'Education', 'Activities', 'Projects', 'Awards', 'Skills'],
    projects: [
      { t: '졸업작품 — RAG 검색', d: '사내 문서 기반 검색 시스템 (학과 우수상)', tags: ['LangChain', 'FastAPI'], col: 'from-indigo-500/50 to-violet-500/20' },
      { t: '교내 해커톤 우승작', d: '캠퍼스 분실물 매칭 앱 — 24시간 개발', tags: ['React Native', 'Firebase'], col: 'from-violet-500/40 to-fuchsia-500/20' },
      { t: '공모전 — 공공데이터', d: '교통 사고 예측 모델 시각화', tags: ['Python', 'Streamlit'], col: 'from-cyan-500/40 to-blue-500/20' },
    ],
    stack: ['Python', 'PyTorch', 'TensorFlow', 'JavaScript', 'React', 'FastAPI', 'PostgreSQL', 'Git'],
    timeline: [
      { y: '2024', t: '교내 SW 해커톤 대상' },
      { y: '2023', t: '오픈소스 컨트리뷰톤 참가' },
      { y: '2023', t: 'AI 학회 부원 활동' },
      { y: '2022', t: '정보처리기사 취득' },
    ],
  },
}
