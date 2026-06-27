import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeMatchRow } from './HomeMatchRow';
import { useLanguage } from '../../hooks/useLanguage';
import { localDateKey } from '../../utils/time';

export function UpcomingMatches({ matches }) {
  const { locale, t } = useLanguage();
  const [selected, setSelected] = useState('all');
  const pillLabel = (date) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(date));
  const pills = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const fixedKeys = new Set([localDateKey(today), localDateKey(tomorrow)]);
    const laterDates = [...new Map(matches.map((match) => [localDateKey(match.kickoffUTC), match.kickoffUTC])).entries()]
      .filter(([key]) => !fixedKeys.has(key))
      .slice(0, 4);
    return [
      ['all', t('home.all')],
      [localDateKey(today), t('home.today')],
      [localDateKey(tomorrow), t('home.tomorrow')],
      ...laterDates.map(([key, date]) => [key, pillLabel(date)]),
    ];
  }, [locale, matches, t]);
  const filtered = selected === 'all'
    ? matches.slice(0, 4)
    : matches.filter((match) => localDateKey(match.kickoffUTC) === selected);

  return (
    <section className="broadcast-card rounded-2xl p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-black uppercase">{t('home.upcomingMatches')}</h2>
        <Link to="/schedule" className="text-xs font-semibold text-neon hover:text-white sm:text-sm">{t('common.viewFullSchedule')}</Link>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {pills.map(([key, label]) => (
          <button key={key} onClick={() => setSelected(key)} className={`h-10 min-h-10 shrink-0 rounded-full px-5 text-xs font-semibold transition ${selected === key ? 'bg-neon text-[#07101c]' : 'border border-white/5 bg-white/[.06] text-white/65 hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/5 bg-white/[.06] text-white/50"><CalendarDays size={16} /></span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/[.08]">
        {filtered.length
          ? filtered.map((match) => <HomeMatchRow key={match.id} match={match} compact />)
          : <p className="px-5 py-9 text-center text-sm text-white/45">{t('home.noMatchesDate')}</p>}
      </div>
    </section>
  );
}
