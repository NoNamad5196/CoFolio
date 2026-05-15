import Groq from 'groq-sdk'
import type { BuilderState, PortfolioResult } from '../types'

// ── Model ─────────────────────────────────────────────────────────────────────
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_KO = '당신은 한국어 전용 어시스턴트입니다. 반드시 한국어(한글)로만 답하세요. 한자, 중국어, 일본어는 절대 사용하지 마세요. 영문 기술 용어(React, TypeScript 등)는 그대로 사용해도 됩니다.'

// ── Utilities ─────────────────────────────────────────────────────────────────
export const hasApiKey = () => !!import.meta.env.VITE_GROQ_API_KEY

function getClient() {
  return new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string,
    dangerouslyAllowBrowser: true,
  })
}

// ── Fallback ──────────────────────────────────────────────────────────────────
export const FALLBACK_RESULT: PortfolioResult = {
  score: 72,
  scoreBreakdown: [
    { label: '완성도', value: 75 },
    { label: '임팩트', value: 68 },
    { label: '기술 깊이', value: 78 },
    { label: '표현력', value: 70 },
    { label: '독창성', value: 69 },
  ],
  enhancedDescriptions: {},
  interviewQuestions: [
    '이 프로젝트에서 가장 어려웠던 기술적 문제는 무엇이었나요?',
    '팀 협업 시 의견 충돌을 어떻게 해결하셨나요?',
    '배포 환경에서 성능 이슈를 경험한 적이 있나요?',
    '프로젝트의 아키텍처 결정 과정을 설명해주세요.',
    '해당 기술스택을 선택한 이유는 무엇인가요?',
    '만약 이 프로젝트를 다시 한다면 무엇을 다르게 하시겠어요?',
    '코드 리뷰나 테스트 전략은 어떻게 가져가셨나요?',
    '사용자 피드백을 어떻게 수집하고 반영하셨나요?',
  ],
  suggestions: [
    '프로젝트마다 결과 수치를 한 줄 더 추가해보세요.',
    '배포 링크가 비어있는 프로젝트가 있습니다.',
    '기술스택을 카테고리별로 분류해보세요.',
  ],
  bioImproved: '',
}

// ── Portfolio analysis ────────────────────────────────────────────────────────
function buildPrompt(state: BuilderState): string {
  const projectList = state.projects.map((p, i) =>
    `프로젝트 ${i + 1} (id: ${p.id}): 제목="${p.title}", 역할="${p.role}", 설명="${p.desc}", GitHub="${p.github}", 배포="${p.deploy}"`
  ).join('\n')

  const stackList = Object.entries(state.stack)
    .filter(([, arr]) => arr.length > 0)
    .map(([cat, arr]) => `${cat}: ${arr.join(', ')}`)
    .join('\n')

  return `당신은 취업 포트폴리오 전문 분석가입니다. 아래 개발자의 포트폴리오 데이터를 분석하고 JSON으로 응답해주세요.

## 포트폴리오 데이터

이름: ${state.profile.name || '미입력'}
직무: ${state.profile.role || '미입력'}
한 줄 소개: ${state.profile.bio || '미입력'}
자기소개: ${state.about.intro || ''}
경력: ${state.about.career || ''}
목표: ${state.about.goals || ''}

기술스택:
${stackList || '미입력'}

프로젝트 목록:
${projectList || '미입력'}

## 응답 형식 (반드시 이 JSON 스키마를 따르세요)

{
  "score": <0~100 정수, 포트폴리오 전체 완성도 점수>,
  "scoreBreakdown": [
    { "label": "완성도", "value": <0~100> },
    { "label": "임팩트", "value": <0~100> },
    { "label": "기술 깊이", "value": <0~100> },
    { "label": "표현력", "value": <0~100> },
    { "label": "독창성", "value": <0~100> }
  ],
  "enhancedDescriptions": {
    <project_id_as_number>: "<개선된 프로젝트 설명 1~2문장, 문제→해결→결과 구조, 한국어>"
  },
  "interviewQuestions": [
    "<이 포트폴리오 기반 예상 면접 질문 8개, 한국어>"
  ],
  "suggestions": [
    "<포트폴리오 개선 제안 3~5개, 구체적이고 실행 가능한 내용, 한국어>"
  ],
  "bioImproved": "<한 줄 소개 개선 버전, 전문성과 자연스러움 균형, 50자 이내, 한국어>"
}

JSON 외 다른 텍스트 없이 순수 JSON만 응답하세요.`
}

export async function analyzePortfolio(state: BuilderState): Promise<PortfolioResult> {
  if (!hasApiKey()) return FALLBACK_RESULT

  const client = getClient()

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_KO },
      { role: 'user', content: buildPrompt(state) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
  })

  const text = completion.choices[0]?.message?.content ?? ''
  const parsed = JSON.parse(text) as Partial<PortfolioResult>

  return {
    score: parsed.score ?? FALLBACK_RESULT.score,
    scoreBreakdown: parsed.scoreBreakdown?.length ? parsed.scoreBreakdown : FALLBACK_RESULT.scoreBreakdown,
    enhancedDescriptions: parsed.enhancedDescriptions ?? {},
    interviewQuestions: parsed.interviewQuestions?.length ? parsed.interviewQuestions : FALLBACK_RESULT.interviewQuestions,
    suggestions: parsed.suggestions?.length ? parsed.suggestions : FALLBACK_RESULT.suggestions,
    bioImproved: parsed.bioImproved ?? '',
  }
}

// ── Per-field AI improvement ──────────────────────────────────────────────────
export type ImproveType = 'bio' | 'project_desc' | 'intro' | 'career' | 'goals'

interface ImproveCtx {
  name?: string
  role?: string
  projectTitle?: string
  projectRole?: string
}

function buildImprovePrompt(type: ImproveType, value: string, ctx: ImproveCtx): string {
  const cur = value.trim() || '(비어있음)'

  switch (type) {
    case 'bio':
      return `개발자 한 줄 소개를 50자 이내 전문적이고 자연스러운 한국어로 개선해주세요.
이름: ${ctx.name || '미입력'} / 직무: ${ctx.role || '미입력'}
현재 소개: ${cur}
개선된 한 줄 소개 텍스트만 출력하세요. 따옴표·설명 없이.`

    case 'project_desc':
      return `프로젝트 설명을 "문제 → 해결 → 결과" 구조로 2~3문장 한국어로 개선해주세요.
프로젝트: ${ctx.projectTitle || '미입력'} / 역할: ${ctx.projectRole || '미입력'}
현재 설명: ${cur}
개선된 설명 텍스트만 출력하세요. 따옴표·설명 없이.`

    case 'intro':
      return `개발자 자기소개를 전문적이고 자연스러운 한국어로 3~4문장으로 개선해주세요.
현재 내용: ${cur}
개선된 자기소개 텍스트만 출력하세요. 따옴표·설명 없이.`

    case 'career':
      return `개발자 경력·활동 소개를 간결하고 임팩트 있는 한국어로 2~3문장으로 개선해주세요.
현재 내용: ${cur}
개선된 텍스트만 출력하세요. 따옴표·설명 없이.`

    case 'goals':
      return `개발자 목표·관심사를 열정과 방향성이 드러나는 한국어로 2문장으로 개선해주세요.
현재 내용: ${cur}
개선된 텍스트만 출력하세요. 따옴표·설명 없이.`
  }
}

export async function improveField(
  type: ImproveType,
  value: string,
  ctx: ImproveCtx = {},
): Promise<string> {
  if (!hasApiKey()) return value

  const client = getClient()
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_KO },
      { role: 'user', content: buildImprovePrompt(type, value, ctx) },
    ],
    temperature: 0.4,
  })

  return completion.choices[0]?.message?.content?.trim() || value
}
