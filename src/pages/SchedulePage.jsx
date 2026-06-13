import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Star } from 'lucide-react';
import { HomeMatchRow } from '../components/home/HomeMatchRow';
import { SearchInput } from '../components/common/SearchInput';
import { StageFilter } from '../components/common/StageFilter';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';
import { filterMatches, sortByKickoff } from '../utils/matchHelpers';
import backgroundDesktop from '../assets/updatedBGbig.png';
import backgroundMobile from '../assets/updatedBGmobile.png';
import { useLanguage } from '../hooks/useLanguage';
import { localizeTimezone } from '../i18n/entities';

export default function SchedulePage() {
  const { language, t } = useLanguage();
  const { matches, loading } = useMatchData();
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const positioned = useRef(false);

  const filtered = useMemo(
    () => sortByKickoff(filterMatches(matches, filter, search, favorites, onlyFavorites, language)),
    [matches, filter, search, favorites, onlyFavorites, language],
  );

  useEffect(() => {
    if (loading || positioned.current || filter !== 'all' || search || onlyFavorites) return;

    const currentMatch = filtered.find((match) => match.status === 'live')
      ?? filtered.find((match) => (
        match.status !== 'finished'
        && new Date(match.kickoffUTC).getTime() >= Date.now()
      ));

    if (!currentMatch) return;

    positioned.current = true;
    window.requestAnimationFrame(() => {
      document.getElementById(`schedule-match-${currentMatch.id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [filter, filtered, loading, onlyFavorites, search]);

  return (
    <main className="groups-broadcast pb-20">
      <section className="relative overflow-hidden border-b border-white/[.06]">
        <picture className="absolute inset-0">
          <source media="(max-width: 639px)" srcSet={backgroundMobile} />
          <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/55 to-[#020814]" />
        <div className="section-shell relative z-10 flex min-h-[350px] flex-col items-center justify-center py-14 text-center sm:min-h-[400px]">
          <p className="font-heading text-xs font-black uppercase tracking-[.2em] text-neon">{t('schedule.eyebrow')}</p>
          <h1 className="font-heading mt-3 text-5xl font-black uppercase tracking-[-.045em] sm:text-8xl">{t('schedule.title')}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/55 sm:text-base">{t('schedule.description', { timezone: localizeTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone, language) })}</p>
        </div>
      </section>

      <div className="section-shell -mt-5 relative z-10">
        <section className="broadcast-card sticky top-20 z-20 flex flex-col gap-3 rounded-2xl p-3 md:flex-row">
          <SearchInput value={search} onChange={setSearch} />
          <StageFilter value={filter} onChange={setFilter} />
          <button onClick={() => setOnlyFavorites(!onlyFavorites)} className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${onlyFavorites ? 'border-neon/40 bg-neon/10 text-neon' : 'border-white/10 bg-white/5 text-white/55 hover:text-white'}`}>
            <Star size={16} fill={onlyFavorites ? 'currentColor' : 'none'} /> {t('schedule.myTeams')}
          </button>
        </section>

        <div className="my-6 flex items-center justify-between text-xs text-white/40">
          <span>{t('schedule.matchCount', { count: filtered.length })}</span>
          <span className="flex items-center gap-2"><CalendarDays size={14} className="text-neon" /> {t('schedule.localTimes')}</span>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></div>
        ) : (
          <section className="broadcast-card overflow-hidden rounded-2xl">
            {filtered.length ? filtered.map((match) => <HomeMatchRow key={match.id} match={match} compact anchorId={`schedule-match-${match.id}`} />) : (
              <p className="px-6 py-16 text-center text-sm text-white/45">
                {onlyFavorites && !favorites.length ? t('schedule.favoriteEmpty') : t('schedule.filterEmpty')}
              </p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
