import type { TagTone } from '../types'

export interface PricingPlan {
  name: string
  price: string
  per: string
  desc: string
  features: string[]
  cta: string
  recommended: boolean
  tone: TagTone
  tagLabel: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '₩0',
    per: '/월',
    desc: '가볍게 시작해보세요.',
    features: ['포트폴리오 1개', '기본 템플릿', '프로젝트 카드 3개', '기본 AI 문장 개선'],
    cta: '무료로 시작하기',
    recommended: false,
    tone: 'slate',
    tagLabel: 'Starter',
  },
  {
    name: 'Pro',
    price: '₩12,900',
    per: '/월',
    desc: '제한 없이 성장하세요.',
    features: ['포트폴리오 무제한', '프리미엄 템플릿', '프로젝트 카드 무제한', 'GitHub 연동', '고급 AI 문장 개선', 'README 내보내기'],
    cta: 'Pro 시작하기',
    recommended: true,
    tone: 'violet',
    tagLabel: 'Most popular',
  },
  {
    name: 'Career',
    price: '₩24,900',
    per: '/월',
    desc: '취업 준비에 최적화.',
    features: ['자기소개서/이력서 문장 개선', '면접 질문 생성', '커스텀 도메인', '채용용 포트폴리오 분석', '우선 지원'],
    cta: 'Career 시작하기',
    recommended: false,
    tone: 'cyan',
    tagLabel: 'For job seekers',
  },
]

export const FAQ_ITEMS: [string, string][] = [
  ['코딩을 몰라도 사용할 수 있나요?', '네, 코딩 지식이 없어도 사용 가능합니다. 프로젝트 설명과 기본 정보만 입력하면 Cofolio AI가 구조와 디자인을 자동으로 정리합니다.'],
  ['GitHub 프로젝트를 가져올 수 있나요?', 'GitHub 계정을 연결하면 저장소 정보와 README를 자동으로 불러와 포트폴리오 카드 형태로 변환해줍니다.'],
  ['포트폴리오를 배포할 수 있나요?', 'Cofolio가 제공하는 cofolio.app 서브도메인으로 즉시 배포할 수 있으며, Pro 이상 플랜에서는 커스텀 도메인 연결도 지원합니다.'],
  ['무료로 사용할 수 있나요?', 'Free 플랜에서는 포트폴리오 1개, 프로젝트 카드 3개, 기본 AI 문장 개선까지 무제한으로 사용할 수 있습니다.'],
  ['만든 포트폴리오를 PDF나 README로 내보낼 수 있나요?', 'Pro 플랜부터 PDF, README.md, JSON 형식으로 내보내기를 지원합니다. 채용 사이트 첨부용으로도 활용할 수 있습니다.'],
  ['커스텀 도메인을 연결할 수 있나요?', 'Pro / Career 플랜에서 본인 소유 도메인을 연결할 수 있습니다. CNAME 설정 가이드를 함께 제공해 드립니다.'],
  ['학생도 사용할 수 있나요?', '물론입니다. 학교 메일 인증을 통해 모든 유료 플랜을 50% 할인된 가격으로 이용할 수 있습니다.'],
]
