import { GoogleGenAI } from '@google/genai'
import type { BuilderState, PortfolioResult } from '../types'

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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return FALLBACK_RESULT

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: buildPrompt(state),
    config: { responseMimeType: 'application/json' },
  })

  const text = response.text ?? ''
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
