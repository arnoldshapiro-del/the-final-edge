export function Icon({ name, className = 'w-5 h-5', stroke = 'currentColor' }) {
  const p = { width: undefined, height: undefined, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (name) {
    case 'home': return <svg className={className} {...p}><path d="M3 11 L12 3 L21 11"/><path d="M5 10 V20 H19 V10"/></svg>
    case 'book': return <svg className={className} {...p}><path d="M4 4h7a3 3 0 0 1 3 3v13"/><path d="M20 4h-7a3 3 0 0 0-3 3v13"/></svg>
    case 'target': return <svg className={className} {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill={stroke} stroke="none"/></svg>
    case 'chart': return <svg className={className} {...p}><path d="M3 18 L9 12 L13 16 L21 6"/><circle cx="21" cy="6" r="2" fill="#FFB347" stroke="none"/></svg>
    case 'stats': return <svg className={className} {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20V12"/><path d="M22 20V8"/></svg>
    case 'gear': return <svg className={className} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z"/></svg>
    case 'arrow': return <svg className={className} {...p}><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>
    case 'back': return <svg className={className} {...p}><path d="M19 12H5"/><path d="M11 19l-7-7 7-7"/></svg>
    case 'check': return <svg className={className} {...p}><path d="M20 6 9 17l-5-5"/></svg>
    case 'x': return <svg className={className} {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>
    case 'spark': return <svg className={className} {...p}><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M5.6 5.6l2.8 2.8"/><path d="M15.6 15.6l2.8 2.8"/><path d="M5.6 18.4l2.8-2.8"/><path d="M15.6 8.4l2.8-2.8"/></svg>
    case 'lock': return <svg className={className} {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
    case 'play': return <svg className={className} {...p}><path d="M6 4l14 8-14 8z" fill={stroke}/></svg>
    case 'pause': return <svg className={className} {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
    case 'flame': return <svg className={className} {...p}><path d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 1-4 2-5 0 3 2 3 2 3-2-2 0-6 0-6z"/></svg>
    case 'shield': return <svg className={className} {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>
    case 'plus': return <svg className={className} {...p}><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    case 'trash': return <svg className={className} {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
    case 'edit': return <svg className={className} {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
    case 'compass': return <svg className={className} {...p}><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/></svg>
    case 'refresh': return <svg className={className} {...p}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
    case 'clock': return <svg className={className} {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
    case 'download': return <svg className={className} {...p}><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>
    case 'upload': return <svg className={className} {...p}><path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M4 3h16"/></svg>
    case 'alert': return <svg className={className} {...p}><path d="M12 3 2 20h20z"/><path d="M12 9v5"/><circle cx="12" cy="17" r="0.5" fill={stroke}/></svg>
    case 'heart': return <svg className={className} {...p}><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.3 12C19 16.4 12 21 12 21z"/></svg>
    default: return null
  }
}
