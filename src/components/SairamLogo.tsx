export default function SairamLogo({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg bg-indigo-950/60 border border-indigo-700/50 p-1">
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield */}
          <path d="M20 4L7 9V19C7 27.5 12.5 35 20 37C27.5 35 33 27.5 33 19V9L20 4Z" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
          {/* Inner Lion/Torch Motif */}
          <circle cx="20" cy="16" r="5" fill="#f59e0b" />
          <path d="M14 26C14 23 16.5 21 20 21C23.5 21 26 23 26 26H14Z" fill="#fbbf24"/>
          <path d="M18 10L20 7L22 10" stroke="#fef3c7" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Insignia Crest */}
      <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-950 border border-amber-400/40 p-1 flex items-center justify-center shadow-inner">
        <svg viewBox="0 0 40 40" className="w-8 h-8 text-amber-400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shield */}
          <path d="M20 4L7 9V19C7 27.5 12.5 35 20 37C27.5 35 33 27.5 33 19V9L20 4Z" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
          {/* Torch & Flame */}
          <path d="M17 14C17 12 20 9 20 9C20 9 23 12 23 14C23 15.5 21.8 17 20 17C18.2 17 17 15.5 17 14Z" fill="#fbbf24"/>
          <path d="M19 17H21V23H19V17Z" fill="#f59e0b"/>
          {/* Book / Pedestal */}
          <path d="M13 25C16 23 20 23.5 20 25C20 23.5 24 23 27 25V27C24 25.5 20 25.5 20 27C20 25.5 16 25.5 13 27V25Z" fill="#e0e7ff"/>
        </svg>
      </div>
      
      {/* College & Center Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-wider text-amber-300 uppercase">SRI SAIRAM</span>
          <span className="text-[10px] px-1 py-0.2 bg-amber-400/20 text-amber-200 rounded font-medium">EDC</span>
        </div>
        <div className="font-semibold text-xs text-white leading-tight truncate">Incubation Centre</div>
        <div className="text-[11px] text-indigo-300/80 leading-tight truncate">Food Token System</div>
      </div>
    </div>
  );
}
