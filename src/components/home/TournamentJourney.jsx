import { Medal, Trophy, Users, Waypoints } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeStage } from '../../i18n/entities';

const stages = [
  [Users, 'Group Stage', '2026-06-11', '2026-06-27'],
  [Waypoints, 'Round of 32', '2026-06-28', '2026-07-03'],
  [Trophy, 'Quarter Finals', '2026-07-09', '2026-07-11'],
  [Medal, 'Semi Finals', '2026-07-14', '2026-07-15'],
  [Trophy, 'Final', '2026-07-19', null],
];

export function TournamentJourney() {
  const { locale, t } = useLanguage();
  const formatDate = (date) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00Z`));
  const now = Date.now();
  const activeStage = stages.reduce((current, [, stage, start]) => (
    now >= new Date(`${start}T00:00:00`).getTime() ? stage : current
  ), stages[0][1]);

  return (
    <section className="broadcast-card rounded-2xl p-5 sm:p-7">
      <div className="mb-7 flex items-center gap-3">
        <Trophy className="text-neon" size={22} />
        <h2 className="font-heading text-xl font-black uppercase">{t('home.tournamentJourney')}</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-5 sm:gap-2">
        {stages.map(([Icon, stage, start, end], index) => {
          const active = stage === activeStage;
          return (
          <div key={stage} className="relative flex items-center gap-4 sm:block sm:text-center">
            {index < stages.length - 1 && <span className={`absolute start-6 top-12 h-[calc(100%+1.5rem)] border-s border-dashed sm:start-1/2 sm:top-6 sm:h-px sm:w-full sm:border-s-0 sm:border-t ${active ? 'border-neon' : 'border-white/20'}`} />}
            <span className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border sm:mx-auto ${active ? 'border-neon/40 bg-neon/15 text-neon shadow-[0_0_20px_rgba(200,255,0,.15)]' : 'border-white/10 bg-[#101722] text-white/40'}`}>
              <Icon size={22} />
            </span>
            <div className="sm:mt-4">
              <strong className={`font-heading block text-xs font-black uppercase ${active ? 'text-neon' : 'text-white'}`}>{localizeStage(stage, t)}</strong>
              <span className="mt-1 block text-xs text-white/45">{end ? `${formatDate(start)} - ${formatDate(end)}` : formatDate(start)}</span>
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
