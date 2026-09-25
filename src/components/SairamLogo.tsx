'use client';

const sairamLogo = '/sairam-engineering-college-logo.png';

export default function SairamLogo({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div
        className="w-10 h-10 mx-auto rounded-lg bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden border border-amber-400/40"
        title="Sri Sairam Engineering College - Incubation Centre"
      >
        <div className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-start shrink-0">
          <img
            src={sairamLogo}
            alt="Sri Sairam Engineering College Logo"
            className="h-8 max-w-none object-cover"
            style={{ objectPosition: '0% 50%' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Official Sairam Logo Crest */}
      <div className="w-10 h-10 shrink-0 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center overflow-hidden border border-amber-400/40">
        <div className="w-8 h-8 overflow-hidden rounded-full flex items-center justify-start shrink-0">
          <img
            src={sairamLogo}
            alt="Sri Sairam Engineering College Logo"
            className="h-8 max-w-none object-cover"
            style={{ objectPosition: '0% 50%' }}
          />
        </div>
      </div>

      {/* College & Center Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-wider text-amber-300 uppercase">SRI SAIRAM</span>
          <span className="text-[10px] px-1 py-0.2 bg-amber-400/20 text-amber-200 rounded font-semibold">EDC</span>
        </div>
        <div className="font-semibold text-xs text-white leading-tight truncate">Incubation Centre</div>
        <div className="text-[11px] text-indigo-200/80 leading-tight truncate">Food Token System</div>
      </div>
    </div>
  );
}
