
export type IconName =
  | 'sparkles' | 'wand' | 'github' | 'rocket' | 'code' | 'layers' | 'palette'
  | 'file' | 'msg' | 'check' | 'x' | 'arrow' | 'chevron-down' | 'play' | 'search'
  | 'menu' | 'users' | 'graduation' | 'monitor' | 'globe' | 'chart' | 'eye' | 'zap'
  | 'shield' | 'heart' | 'link' | 'tag' | 'folder' | 'logo-c' | 'download' | 'share'
  | 'plus' | 'star' | 'branch'

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 18, strokeWidth = 1.6, className = '' }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }
  switch (name) {
    case 'sparkles': return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>
    case 'wand': return <svg {...common}><path d="M15 4l5 5-11 11H4v-5L15 4z"/><path d="M14 5l5 5"/></svg>
    case 'github': return <svg {...common}><path d="M9 19c-4 1.5-4-2-6-2"/><path d="M15 22v-3.8a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.4-1.5 6.4-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C5.3 1 4 1.4 4 1.4a5 5 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.5 3.8c0 5.5 3.3 6.7 6.4 7a3.4 3.4 0 0 0-.9 2.5V22"/></svg>
    case 'rocket': return <svg {...common}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.7a1.9 1.9 0 0 0-3 0z"/><path d="M12 15l-3-3a22 22 0 0 1 5.5-9.5c2-2 6-2.5 6.5-2 .5.5 0 4.5-2 6.5A22 22 0 0 1 9.5 12.5z"/><path d="M9 12H4s.5-3 2-4.5C7 6 9 6 9 6"/><path d="M12 15v5s3-.5 4.5-2c1-1 1-3 1-3"/></svg>
    case 'code': return <svg {...common}><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>
    case 'layers': return <svg {...common}><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>
    case 'palette': return <svg {...common}><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.8-1.2-.8-2 0-1.7 1.3-3 3-3h1.8A4 4 0 0 0 22 8a10 10 0 0 0-10-6z"/></svg>
    case 'file': return <svg {...common}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
    case 'msg': return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    case 'check': return <svg {...common}><path d="M20 6L9 17l-5-5"/></svg>
    case 'x': return <svg {...common}><path d="M18 6L6 18M6 6l12 12"/></svg>
    case 'arrow': return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
    case 'chevron-down': return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>
    case 'play': return <svg {...common}><path d="M5 3l14 9-14 9V3z"/></svg>
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
    case 'menu': return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    case 'users': return <svg {...common}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1A4 4 0 0 1 16 11"/></svg>
    case 'graduation': return <svg {...common}><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>
    case 'monitor': return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    case 'globe': return <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>
    case 'chart': return <svg {...common}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/></svg>
    case 'eye': return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>
    case 'zap': return <svg {...common}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
    case 'shield': return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    case 'heart': return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    case 'link': return <svg {...common}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
    case 'tag': return <svg {...common}><path d="M20 12l-8 8a2 2 0 0 1-3 0l-7-7V4h6l8 8a2 2 0 0 1 0 3z"/><circle cx="7" cy="7" r="1"/></svg>
    case 'folder': return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    case 'logo-c': return (
      <svg {...common} viewBox="0 0 24 24">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a78bfa"/><stop offset=".55" stopColor="#6366f1"/><stop offset="1" stopColor="#22d3ee"/></linearGradient></defs>
        <circle cx="12" cy="12" r="9" stroke="url(#cg)" strokeWidth="2"/>
        <path d="M16 8.5a5 5 0 1 0 0 7" stroke="url(#cg)" strokeWidth="2"/>
        <circle cx="16.5" cy="12" r="1.6" fill="url(#cg)" stroke="none"/>
      </svg>
    )
    case 'download': return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>
    case 'share': return <svg {...common}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>
    case 'star': return <svg {...common}><path d="M12 2l3 7 7 .8-5.3 4.8 1.6 7.4L12 18l-6.3 4 1.6-7.4L2 9.8 9 9z"/></svg>
    case 'branch': return <svg {...common}><circle cx="6" cy="3" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 5v8a4 4 0 0 0 4 4h6"/><path d="M18 8v2"/></svg>
    default: return null
  }
}
