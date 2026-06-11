import { ArrowRight, CalendarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { LoadingCard } from '../components/common/LoadingCard';
import { HomeMatchRow } from '../components/home/HomeMatchRow';
import { QuickActions } from '../components/home/QuickActions';
import { TournamentJourney } from '../components/home/TournamentJourney';
import { UpcomingMatches } from '../components/home/UpcomingMatches';
import { useMatchData } from '../hooks/useMatchData';
import { getNextMatch, isToday } from '../utils/time';
import { sortByKickoff } from '../utils/matchHelpers';

function SectionHeader({ title, to = '/schedule', linkLabel = 'View all' }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_14px_rgba(200,255,0,.8)]" />
        <h2 className="font-heading text-xl font-black uppercase sm:text-2xl">{title}</h2>
      </div>
      <Link to={to} className="flex items-center gap-2 text-xs font-semibold text-neon transition hover:text-white sm:text-sm">
        {linkLabel} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { matches, loading, error } = useMatchData();

  if (error) return <main className="section-shell py-24 text-center text-red-300">{error}</main>;
  if (loading) return <main className="section-shell grid gap-4 py-24 md:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></main>;

  const sorted = sortByKickoff(matches);
  const nextMatch = getNextMatch(sorted);
  const today = sorted.filter((match) => isToday(match.kickoffUTC));
  const upcoming = sorted.filter((match) => match.status === 'live' || new Date(match.kickoffUTC) >= new Date());

  return (
    <main className="home-broadcast pb-20">
      <Hero match={nextMatch} />
      <QuickActions />

      <div className="section-shell mt-12 space-y-8">
        <section>
          <SectionHeader title="Today's Matches" />
          <div className="broadcast-card overflow-hidden rounded-2xl">
            {today.length ? today.map((match) => <HomeMatchRow key={match.id} match={match} />) : (
              <div className="flex min-h-32 flex-col items-center justify-center px-6 py-8 text-center">
                <CalendarOff className="mb-3 text-neon" size={25} />
                <strong className="font-heading text-sm font-black uppercase">No matches today</strong>
                <span className="mt-1 text-xs text-white/45">The tournament kicks off on the next matchday.</span>
              </div>
            )}
          </div>
        </section>

        <TournamentJourney />
        <UpcomingMatches matches={upcoming} />
      </div>
    </main>
  );
}
