import { ArrowRight, CalendarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { MatchList } from '../components/match/MatchList';
import { TournamentStats } from '../components/stats/TournamentStats';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';
import { daysUntil, getNextMatch, isToday } from '../utils/time';
import { sortByKickoff } from '../utils/matchHelpers';

function SectionHeading({ eyebrow, title, link }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.28em] text-gold">{eyebrow}</p><h2 className="font-heading text-2xl font-bold sm:text-3xl">{title}</h2></div>
      {link && <Link to={link} className="hidden items-center gap-2 text-sm font-semibold text-text-secondary hover:text-gold sm:flex">View all <ArrowRight size={16} /></Link>}
    </div>
  );
}

export default function HomePage() {
  const { matches, groups, loading, error } = useMatchData();
  const { favorites, toggleFavorite } = useFavorites();
  if (error) return <main className="section-shell py-24 text-center text-red-300">{error}</main>;
  if (loading) return <main className="section-shell grid gap-4 py-24 md:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></main>;

  const sorted = sortByKickoff(matches);
  const nextMatch = getNextMatch(sorted);
  const today = sorted.filter((match) => isToday(match.kickoffUTC));
  const upcoming = sorted.filter((match) => new Date(match.kickoffUTC) >= new Date()).slice(0, 6);
  return (
    <main>
      <Hero match={nextMatch} />
      <div className="section-shell space-y-20 pt-20">
        <section>
          <SectionHeading eyebrow="Matchday" title="Today's matches" />
          {today.length ? (
            <div className="rounded-[2rem] border border-gold/25 bg-gold/[.025] p-3 sm:p-5"><MatchList matches={today} favorites={favorites} onToggleFavorite={toggleFavorite} /></div>
          ) : (
            <div className="glass flex flex-col items-center rounded-3xl px-6 py-12 text-center">
              <CalendarOff className="mb-4 text-gold" size={30} />
              <h3 className="font-heading text-xl font-bold">No matches today</h3>
              <p className="mt-2 text-sm text-text-secondary">The next kickoff is in {daysUntil(nextMatch.kickoffUTC)} days.</p>
            </div>
          )}
        </section>
        <section>
          <SectionHeading eyebrow="Coming up" title="Next on the pitch" link="/schedule" />
          <MatchList matches={upcoming} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <Link to="/schedule" className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold sm:hidden">Full schedule <ArrowRight size={16} /></Link>
        </section>
        <section>
          <SectionHeading eyebrow="48 nations" title="Explore the groups" link="/groups" />
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3">
            {groups.map((group) => (
              <Link key={group.group} to={`/groups?group=${group.group}`} className="glass glass-hover min-w-52 snap-start rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between"><strong className="font-heading text-lg">Group {group.group}</strong><span className="text-2xl font-black text-white/10">{group.group}</span></div>
                <p className="line-clamp-2 text-xs leading-5 text-text-secondary">{group.teams.map((team) => team.name).join(' • ')}</p>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <SectionHeading eyebrow="Biggest ever" title="Tournament by the numbers" />
          <TournamentStats />
        </section>
      </div>
    </main>
  );
}
