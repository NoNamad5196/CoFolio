import { useState } from 'react'
import { Section, SectionHeading } from '../common/Section'
import { Tag } from '../common/Tag'
import { Icon } from '../common/Icon'
import { TemplatePreviewModal } from '../modals/TemplatePreviewModal'
import type { TemplateType } from '../../types'

const TEMPLATE_ITEMS = [
  {
    t: 'Developer' as const,
    typeId: 'developer' as TemplateType,
    d: '개발자 프로젝트와 기술스택을 강조하는 템플릿',
    tags: ['GitHub 연동', '코드 카드', '기술 그래프'],
    tone: 'violet' as const,
    tagLabel: '개발자',
    preview: (
      <div className="space-y-2">
        <div className="h-3 w-1/2 rounded bg-white/15" />
        <div className="h-2 w-2/3 rounded bg-white/8" />
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <div className="h-12 rounded bg-gradient-to-br from-violet-500/40 to-indigo-500/10" />
          <div className="h-12 rounded bg-gradient-to-br from-cyan-500/30 to-blue-500/10" />
        </div>
        <div className="flex gap-1 mt-1">
          <div className="h-1.5 w-8 rounded bg-violet-400/50" />
          <div className="h-1.5 w-6 rounded bg-cyan-400/50" />
          <div className="h-1.5 w-10 rounded bg-indigo-400/50" />
        </div>
      </div>
    ),
  },
  {
    t: 'Designer' as const,
    typeId: 'designer' as TemplateType,
    d: '비주얼 작업물과 케이스 스터디를 강조하는 템플릿',
    tags: ['대형 썸네일', '케이스 스터디', '무드보드'],
    tone: 'cyan' as const,
    tagLabel: '디자이너',
    preview: (
      <div className="space-y-2">
        <div className="h-16 rounded bg-gradient-to-br from-fuchsia-500/40 via-violet-500/30 to-cyan-500/30" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-7 rounded bg-white/10" />
          <div className="h-7 rounded bg-white/8" />
          <div className="h-7 rounded bg-white/12" />
        </div>
        <div className="h-2 w-1/3 rounded bg-white/15" />
      </div>
    ),
  },
  {
    t: 'Student' as const,
    typeId: 'student' as TemplateType,
    d: '학업, 프로젝트, 공모전, 활동 경험을 균형 있게 보여주는 템플릿',
    tags: ['타임라인', '수상 이력', '활동 카드'],
    tone: 'indigo' as const,
    tagLabel: '학생',
    preview: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-indigo-400/40" />
          <div className="space-y-1 flex-1">
            <div className="h-2 w-2/3 rounded bg-white/15" />
            <div className="h-1.5 w-1/2 rounded bg-white/8" />
          </div>
        </div>
        <div className="border-l border-violet-400/30 pl-2 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded bg-white/10" />
          <div className="h-1.5 w-2/3 rounded bg-white/8" />
          <div className="h-1.5 w-1/2 rounded bg-white/8" />
        </div>
      </div>
    ),
  },
]

export function TemplateSection() {
  const [selected, setSelected] = useState<TemplateType | null>(null)

  return (
    <Section id="templates" className="py-24">
      <SectionHeading
        eyebrow="TEMPLATES"
        title={<>나에게 맞는 <span className="text-grad">포트폴리오 템플릿</span>을 선택하세요.</>}
        sub="역할과 목적에 따라 구조와 강조점이 다른 템플릿을 제공합니다."
      />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {TEMPLATE_ITEMS.map((it, i) => (
          <div key={it.t} className="reveal group glass lift rounded-2xl overflow-hidden" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="relative h-44 overflow-hidden border-b border-white/8 bg-ink-900/60">
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-x-3 top-3">
                <div className="rounded-lg bg-ink-800/80 backdrop-blur p-3 transition-transform group-hover:-translate-y-1">
                  {it.preview}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-900 to-transparent" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-[16px] font-semibold tracking-tight">{it.t}</div>
                <Tag tone={it.tone}>{it.tagLabel}</Tag>
              </div>
              <div className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">{it.d}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {it.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-slate-300">{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelected(it.typeId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-[12px] text-violet-100 hover:bg-violet-500/20"
                >
                  <Icon name="eye" size={12} /> 미리보기
                </button>
                <Icon name="arrow" size={14} className="text-slate-500 group-hover:text-violet-300 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <TemplatePreviewModal
        isOpen={selected !== null}
        templateId={selected}
        onClose={() => setSelected(null)}
      />
    </Section>
  )
}
