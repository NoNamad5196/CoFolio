export interface AnalysisMetric {
  l: string
  v: number
  c: string
}

export interface ChecklistItem {
  label: string
  ok: boolean
}

export interface ScoreStat {
  label: string
  value: string
  tone: 'violet' | 'cyan' | 'indigo'
}

export const SCORE_METRICS: AnalysisMetric[] = [
  { l: '프로젝트 설명 명확도', v: 92, c: '#a78bfa' },
  { l: '기술스택 정리도', v: 88, c: '#818cf8' },
  { l: '링크 완성도', v: 76, c: '#f472b6' },
  { l: '디자인 일관성', v: 84, c: '#22d3ee' },
  { l: '채용 담당자 관점 가독성', v: 90, c: '#34d399' },
]

export const AI_SUGGESTIONS: string[] = [
  '프로젝트마다 문제 해결 과정을 한 줄 더 추가해보세요.',
  '배포 링크가 없는 프로젝트는 GitHub 링크만으로는 약해 보일 수 있습니다.',
  '기술스택을 Frontend, Backend, AI, Deploy로 나누면 더 읽기 쉽습니다.',
]

export const SCORE_STATS: ScoreStat[] = [
  { label: 'Top', value: '12%', tone: 'violet' },
  { label: '랭크', value: 'Lv.4', tone: 'cyan' },
  { label: '성장', value: '+8%', tone: 'indigo' },
]

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { label: '프로필 정보 입력', ok: true },
  { label: '프로젝트 3개 이상', ok: true },
  { label: '기술스택 카테고리 분류', ok: true },
  { label: '배포 링크 추가', ok: false },
  { label: '면접 질문 검토', ok: false },
]
