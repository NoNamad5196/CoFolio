// Export modal — choose theme + format and "export" the portfolio.
// Used from the result page and dashboard. The export itself is simulated
// (toast + clipboard for the link option) since this is a design prototype.

const EXPORT_FORMATS = [
  {
    id: "html",
    title: "HTML",
    desc: "단일 .html 파일 — 어디서든 바로 열람 가능",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 9-3 3 3 3M15 9l3 3-3 3M14 7l-4 10" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
    badge: "추천",
  },
  {
    id: "pdf",
    title: "PDF 문서",
    desc: "A4 / Letter — 인쇄·이메일 첨부에 최적",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    id: "md",
    title: "Markdown",
    desc: "GitHub 프로필 README에 바로 붙여넣기",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 15V9l3 3 3-3v6M16 9v6M14 13l2 2 2-2" />
      </svg>
    ),
  },
  {
    id: "notion",
    title: "Notion 정리",
    desc: "Notion에 바로 가져갈 수 있게 블록 단위로 정리",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="1.5"/>
        <path d="M8 7h8M8 11h8M8 15h5"/>
      </svg>
    ),
  },
  {
    id: "vercel",
    title: "Vercel 배포 준비",
    desc: "한 번에 배포할 수 있는 프로젝트 패키지 생성",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 22 20H2L12 3z"/>
      </svg>
    ),
  },
];

const EXPORT_THEMES = [
  { id: "dark", title: "다크", sub: "현재 미리보기와 동일", swatch: "linear-gradient(135deg,#0b0f1d,#1d2542)" },
  { id: "light", title: "라이트", sub: "인쇄·이력서에 적합", swatch: "linear-gradient(135deg,#ffffff,#eef0f8)" },
  { id: "auto", title: "시스템 자동", sub: "보는 사람의 설정 따라감", swatch: "linear-gradient(135deg,#0b0f1d 0%,#0b0f1d 50%,#ffffff 50%,#ffffff 100%)" },
];

function ExportModal({ open, onClose, portfolioName = "포트폴리오" }) {
  const [format, setFormat] = React.useState("web");
  const [theme, setTheme] = React.useState("dark");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(null); // { title, sub }

  // Reset state on open
  React.useEffect(() => {
    if (open) { setBusy(false); setDone(null); }
  }, [open]);

  // Lock scroll + ESC to close
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleExport = async () => {
    setBusy(true);
    // Simulated work
    await new Promise((r) => setTimeout(r, 900));
    const slug = encodeURIComponent(portfolioName.toLowerCase().replace(/\s+/g, "-"));
    if (format === "html") {
      setDone({ title: "HTML 다운로드를 시작했어요", sub: `${portfolioName}-${theme}.html` });
    } else if (format === "pdf") {
      setDone({ title: "PDF 다운로드를 시작했어요", sub: `${portfolioName}-${theme}.pdf` });
    } else if (format === "md") {
      setDone({ title: "Markdown이 복사되었습니다", sub: "GitHub 프로필 README에 붙여넣어 보세요" });
    } else if (format === "notion") {
      setDone({ title: "Notion 블록이 복사되었습니다", sub: "Notion 페이지에 붙여넣으면 그대로 정리돼요" });
    } else if (format === "vercel") {
      setDone({ title: "Vercel 배포 패키지가 준비됐어요", sub: `vercel.com/import/${slug} — 한 번 클릭으로 배포` });
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{ animation: "fadeIn .2s ease" }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] rounded-2xl glass-strong overflow-hidden ring-grad"
        style={{ animation: "popIn .3s cubic-bezier(.2,.7,.2,1)" }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/8 flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-violet-300/90">EXPORT</div>
            <div className="mt-1 text-[20px] font-semibold tracking-tight">포트폴리오 내보내기</div>
            <div className="mt-1 text-[12.5px] text-slate-400">형식과 테마를 선택하세요. 언제든 다시 만들 수 있어요.</div>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] h-8 w-8 grid place-items-center text-slate-300 hover:bg-white/[0.08]" aria-label="닫기">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        {!done ? (
          <div className="px-6 py-5 space-y-5">
            {/* Format grid */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-2.5">형식</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXPORT_FORMATS.map((f) => {
                  const sel = format === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={cls(
                        "text-left rounded-xl border p-3.5 transition flex items-start gap-3",
                        sel ? "border-violet-400/60 bg-violet-500/[0.08] ring-1 ring-violet-400/30"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      )}
                    >
                      <div className={cls("grid h-9 w-9 place-items-center rounded-lg shrink-0",
                        sel ? "bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-violet-100" : "bg-white/[0.04] text-slate-300")}>
                        {f.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-[13.5px] font-semibold text-slate-100">{f.title}</div>
                          {f.badge && <Tag tone="violet">{f.badge}</Tag>}
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-slate-400 leading-snug">{f.desc}</div>
                      </div>
                      <div className={cls("mt-0.5 h-4 w-4 shrink-0 rounded-full border", sel ? "border-violet-400 bg-violet-400" : "border-white/20")}>
                        {sel && <svg viewBox="0 0 16 16" className="h-full w-full text-white"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme picker */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-2.5">테마</div>
              <div className="grid grid-cols-3 gap-2.5">
                {EXPORT_THEMES.map((t) => {
                  const sel = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cls(
                        "rounded-xl border p-3 text-left transition",
                        sel ? "border-violet-400/60 bg-violet-500/[0.08] ring-1 ring-violet-400/30"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="h-12 w-full rounded-lg border border-white/10" style={{ background: t.swatch }} />
                      <div className="mt-2 text-[12.5px] font-semibold text-slate-100">{t.title}</div>
                      <div className="text-[10.5px] text-slate-400 leading-snug">{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tiny preview info */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5 flex items-center gap-2.5">
              <div className="h-7 w-7 grid place-items-center rounded-md bg-violet-500/15 text-violet-200">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>
              </div>
              <div className="text-[11.5px] text-slate-400 leading-snug">
                내보낸 결과물에는 Cofolio 워터마크가 포함되지 않습니다. Pro 플랜에서는 커스텀 도메인 연결도 가능해요.
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-14 w-14 grid place-items-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 ring-1 ring-emerald-400/40">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
            </div>
            <div className="mt-3 text-[18px] font-semibold tracking-tight">{done.title}</div>
            <div className="mt-1 text-[12.5px] text-slate-400 break-all">{done.sub}</div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/8 bg-white/[0.02] px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="text-[11.5px] text-slate-500">
            {!done && <>선택: <span className="text-slate-300">{EXPORT_FORMATS.find((f) => f.id === format)?.title}</span> · <span className="text-slate-300">{EXPORT_THEMES.find((t) => t.id === theme)?.title}</span></>}
            {done && <>완료 — 다른 형식으로도 내보낼 수 있어요.</>}
          </div>
          <div className="flex items-center gap-2">
            {!done ? (
              <>
                <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">취소</button>
                <PrimaryBtn size="sm" onClick={handleExport} disabled={busy}>
                  {busy ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" strokeDasharray="42" strokeDashoffset="20"/></svg>처리 중…</>
                  ) : (
                    <>{format === "md" ? "Markdown 복사" : format === "notion" ? "Notion으로 보내기" : format === "vercel" ? "배포 패키지 만들기" : "다운로드"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>
                  )}
                </PrimaryBtn>
              </>
            ) : (
              <>
                <button onClick={() => setDone(null)} className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 h-9 text-[12.5px] text-slate-200 hover:bg-white/[0.08]">다시 내보내기</button>
                <PrimaryBtn size="sm" onClick={onClose}>완료</PrimaryBtn>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ExportModal = ExportModal;
