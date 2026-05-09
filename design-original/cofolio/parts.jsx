// Reusable parts: Section, Tag, Button, GradientHeading, Reveal hook, etc.

const cls = (...xs) => xs.filter(Boolean).join(" ");

function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) {e.target.classList.add("in");io.unobserve(e.target);}});
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const Section = ({ id, children, className = "", containerClassName = "" }) =>
<section id={id} className={cls("relative w-full px-5 sm:px-8", className)}>
    <div className={cls("mx-auto w-full max-w-[1240px]", containerClassName)}>{children}</div>
  </section>;


const Eyebrow = ({ children }) =>
<div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] font-medium text-violet-300/90 backdrop-blur">
    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 anim-pulse"></span>
    {children}
  </div>;


const SectionHeading = ({ eyebrow, title, sub, align = "center" }) =>
<div className={cls("flex flex-col gap-4 reveal", align === "center" ? "items-center text-center" : "items-start text-left")}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="max-w-3xl text-balance text-[34px] sm:text-[44px] md:text-[52px] font-bold leading-[1.15] tracking-tight" style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}>
      {title}
    </h2>
    {sub && <p className="max-w-2xl text-[15px] sm:text-[17px] leading-[1.7] text-slate-400">{sub}</p>}
  </div>;


const Tag = ({ children, tone = "violet" }) => {
  const tones = {
    violet: "border-violet-500/25 bg-violet-500/10 text-violet-200",
    cyan: "border-cyan-500/25 bg-cyan-500/10 text-cyan-200",
    indigo: "border-indigo-500/25 bg-indigo-500/10 text-indigo-200",
    slate: "border-white/10 bg-white/5 text-slate-300",
    pink: "border-pink-500/25 bg-pink-500/10 text-pink-200",
    emerald: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", tones[tone])}>
      {children}
    </span>);

};

const PrimaryBtn = ({ children, size = "md", className = "", ...rest }) => {
  const sz = size === "lg" ? "h-12 px-6 text-[15px]" : size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-[14px]";
  return (
    <button className={cls("btn-primary inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white", sz, className)} {...rest}>
      {children}
    </button>);

};

const GhostBtn = ({ children, size = "md", className = "", ...rest }) => {
  const sz = size === "lg" ? "h-12 px-6 text-[15px]" : size === "sm" ? "h-9 px-4 text-[13px]" : "h-11 px-5 text-[14px]";
  return (
    <button className={cls("btn-ghost inline-flex items-center justify-center gap-2 rounded-xl font-medium text-slate-100", sz, className)} {...rest}>
      {children}
    </button>);

};

const FloatingCard = ({ className = "", children, anim = "anim-float-1" }) =>
<div className={cls("glass-strong rounded-2xl p-3 shadow-[0_20px_60px_-20px_rgba(124,58,237,0.45)]", anim, className)}>
    {children}
  </div>;


// Window chrome dots
const WindowDots = () =>
<div className="flex items-center gap-1.5">
    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80"></span>
    <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80"></span>
    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></span>
  </div>;


// Mini bar/area chart svg
const SparkArea = ({ values, color = "#a78bfa", width = 220, height = 60 }) => {
  const max = Math.max(...values),min = Math.min(...values);
  const w = width,h = height;
  const pts = values.map((v, i) => {
    const x = i / (values.length - 1) * w;
    const y = h - (v - min) / (max - min || 1) * (h - 8) - 4;
    return [x, y];
  });
  const d = pts.map((p, i) => i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const id = "g" + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.5" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" />
    </svg>);

};

// Score ring
const ScoreRing = ({ value = 86, size = 168, label = "Portfolio Score" }) => {
  const p = Math.max(0, Math.min(100, value));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <div className="ring-prog rounded-full" style={{ width: size, height: size, "--p": `${p}%` }}></div>
      <div className="absolute rounded-full bg-ink-900/90" style={{ width: size - 16, height: size - 16 }}></div>
      <div className="absolute flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{label}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-grad text-5xl font-bold leading-none tracking-tight">{p}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-300">+4 since last week</div>
      </div>
      <svg className="absolute -inset-2 pointer-events-none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="ringg" x1="0" x2="1"><stop offset="0" stopColor="#a78bfa" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
        </defs>
      </svg>
    </div>);

};

window.cls = cls;
window.useReveal = useReveal;
window.Section = Section;
window.Eyebrow = Eyebrow;
window.SectionHeading = SectionHeading;
window.Tag = Tag;
window.PrimaryBtn = PrimaryBtn;
window.GhostBtn = GhostBtn;
window.FloatingCard = FloatingCard;
window.WindowDots = WindowDots;
window.SparkArea = SparkArea;
window.ScoreRing = ScoreRing;