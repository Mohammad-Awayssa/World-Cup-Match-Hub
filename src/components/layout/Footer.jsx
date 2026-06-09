import { Trophy } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[.06] bg-black/20">
      <div className="section-shell flex flex-col items-center justify-between gap-5 py-9 text-center text-xs text-text-muted sm:flex-row sm:text-left">
        <div className="flex items-center gap-3"><Trophy className="text-gold" size={20} /><span>World Cup 2026 Match Hub<br />Built for fans across every timezone.</span></div>
        <p>Static MVP data • Flags by flagcdn.com<br />Not affiliated with FIFA.</p>
      </div>
    </footer>
  );
}
