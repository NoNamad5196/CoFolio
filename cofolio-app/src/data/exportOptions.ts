export interface ExportFormat {
  id: string
  title: string
  desc: string
  badge?: string
}

export interface ExportTheme {
  id: string
  title: string
  sub: string
  swatch: string
}

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'html',
    title: 'HTML',
    desc: '단일 .html 파일 — 어디서든 바로 열람 가능',
    badge: '추천',
  },
  {
    id: 'pdf',
    title: 'PDF 문서',
    desc: 'A4 / Letter — 인쇄·이메일 첨부에 최적',
  },
  {
    id: 'md',
    title: 'Markdown',
    desc: 'GitHub 프로필 README에 바로 붙여넣기',
  },
  {
    id: 'notion',
    title: 'Notion 정리',
    desc: 'Notion에 바로 가져갈 수 있게 블록 단위로 정리',
  },
  {
    id: 'vercel',
    title: 'Vercel 배포 준비',
    desc: '한 번에 배포할 수 있는 프로젝트 패키지 생성',
  },
]

export const EXPORT_THEMES: ExportTheme[] = [
  { id: 'dark', title: '다크', sub: '현재 미리보기와 동일', swatch: 'linear-gradient(135deg,#0b0f1d,#1d2542)' },
  { id: 'light', title: '라이트', sub: '인쇄·이력서에 적합', swatch: 'linear-gradient(135deg,#ffffff,#eef0f8)' },
  { id: 'auto', title: '시스템 자동', sub: '보는 사람의 설정 따라감', swatch: 'linear-gradient(135deg,#0b0f1d 0%,#0b0f1d 50%,#ffffff 50%,#ffffff 100%)' },
]
