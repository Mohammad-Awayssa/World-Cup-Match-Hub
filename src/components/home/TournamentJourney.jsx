import { Medal, Trophy, Users, Waypoints } from 'lucide-react';

const stages = [
  [Users, 'Group Stage', 'Jun 11 - Jun 27', true],
  [Waypoints, 'Round of 32', 'Jun 28 - Jul 03'],
  [Trophy, 'Quarter-finals', 'Jul 09 - Jul 11'],
  [Medal, 'Semi-finals', 'Jul 14 - Jul 15'],
  [Trophy, 'Final', 'Jul 19, 2026'],
];

export function TournamentJourney() {
  return (
    <section className="broadcast-card rounded-2xl p-5 sm:p-7">
      <div className="mb-7 flex items-center gap-3">
        <Trophy className="text-neon" size={22} />
        <h2 className="font-heading text-xl font-black uppercase">Tournament Journey</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-5 sm:gap-2">
        {stages.map(([Icon, title, dates, active], index) => (
          <div key={title} className="relative flex items-center gap-4 sm:block sm:text-center">
            {index < stages.length - 1 && <span className={`absolute left-6 top-12 h-[calc(100%+1.5rem)] border-l border-dashed sm:left-1/2 sm:top-6 sm:h-px sm:w-full sm:border-l-0 sm:border-t ${active ? 'border-neon' : 'border-white/20'}`} />}
            <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border sm:mx-auto ${active ? 'border-neon/40 bg-neon/15 text-neon shadow-[0_0_20px_rgba(200,255,0,.15)]' : 'border-white/10 bg-[#101722] text-white/40'}`}>
              <Icon size={22} />
            </span>
            <div className="sm:mt-4">
              <strong className={`font-heading block text-xs font-black uppercase ${active ? 'text-neon' : 'text-white'}`}>{title}</strong>
              <span className="mt-1 block text-xs text-white/45">{dates}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
