import { Section } from '../common/Section'
import { Icon } from '../common/Icon'

const FOOTER_COLS = [
  ['Product', ['기능', '템플릿', '쇼케이스', '요금제', '변경 로그']],
  ['Resources', ['가이드', '블로그', '고객 사례', '개발자 문서', '상태 페이지']],
  ['Company', ['회사 소개', '채용', '연락처', '미디어 키트', '파트너십']],
] as const

const SOCIAL_LINKS = [
  { i: 'github', l: 'GitHub' },
  { i: 'globe', l: 'Website' },
  { i: 'msg', l: 'Discord' },
  { i: 'share', l: 'X' },
] as const

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-12">
      <Section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl glass ring-grad">
                <Icon name="logo-c" size={22} />
              </div>
              <div className="text-[17px] font-bold tracking-tight">Cofolio</div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] text-slate-400 leading-[1.7]">
              Cofolio는 프로젝트, 기술스택, GitHub 정보를 정리해 채용 담당자가 보기 좋은 포트폴리오로 완성해주는 AI 포트폴리오 빌더입니다.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.l} aria-label={s.l} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/8 hover:text-white cursor-pointer">
                  <Icon name={s.i as any} size={14} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(([title, items]) => (
            <div key={title}>
              <div className="text-[12px] uppercase tracking-[0.16em] text-slate-500 mb-3">{title}</div>
              <ul className="space-y-2">
                {items.map((l) => (
                  <li key={l}><a className="text-[13px] text-slate-300 hover:text-white cursor-pointer">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/5 pt-6">
          <div className="text-[12px] text-slate-500">© 2026 Cofolio Inc. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[12px] text-slate-500">
            <a className="hover:text-slate-300 cursor-pointer">개인정보처리방침</a>
            <a className="hover:text-slate-300 cursor-pointer">이용약관</a>
            <a className="hover:text-slate-300 cursor-pointer">쿠키 정책</a>
          </div>
        </div>
      </Section>
    </footer>
  )
}
