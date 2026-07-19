import { useState, useCallback, useMemo } from 'react';
import { ArrowRight, CalendarOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/hero/Hero';
import { HomeMatchRow } from '../components/home/HomeMatchRow';
import { QuickActions } from '../components/home/QuickActions';
import { TournamentJourney } from '../components/home/TournamentJourney';
import { UpcomingMatches } from '../components/home/UpcomingMatches';
import { WinnerCelebration, STORAGE_KEY } from '../components/celebration/WinnerCelebration';
import { ThankYouScreen } from '../components/celebration/ThankYouScreen';
import { useMatchData } from '../hooks/useMatchData';
import { getNextMatches, isToday } from '../utils/time';
import { sortByKickoff } from '../utils/matchHelpers';
import { useLanguage } from '../hooks/useLanguage';
import { getMatchScores } from '../utils/score';

function SectionHeader({ title, to = '/schedule', linkLabel }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neon shadow-[0_0_14px_rgba(200,255,0,.8)]" />
        <h2 className="font-heading text-xl font-black uppercase sm:text-2xl">{title}</h2>
      </div>
      <Link to={to} className="flex items-center gap-2 text-xs font-semibold text-neon transition hover:text-white sm:text-sm">
        {linkLabel} <ArrowRight className="rtl-flip" size={16} />
      </Link>
    </div>
  );
}

function HomeLoadingState({ multiple = false }) {
  return (
    <main className="home-broadcast pb-20">
      <section className="relative overflow-hidden border-b border-white/[.06]">
        <div className="section-shell flex min-h-[650px] flex-col items-center justify-center py-10 sm:min-h-[700px] sm:py-14">
          <div className={`match-hero-card w-full animate-pulse rounded-[1.75rem] ${multiple ? 'h-[720px] max-w-6xl md:h-[520px]' : 'h-[360px] max-w-3xl sm:h-[430px]'}`} />
        </div>
      </section>
      <div className="section-shell mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="broadcast-card min-h-36 animate-pulse rounded-2xl" />
        ))}
      </div>
    </main>
  );
}

/* ── Determine if final match has a winner ── */
function hasFinalWinner(match) {
  if (!match || match.status !== 'finished') return false;
  const { homeScore, awayScore, homePenalties, awayPenalties } = getMatchScores(match);
  if (homeScore == null || awayScore == null) return false;
  if (homeScore !== awayScore) return true;
  if (homePenalties != null && awayPenalties != null && homePenalties !== awayPenalties) return true;
  return false;
}

/* ── Check if celebration was already shown ── */
function wasCelebrationShown() {
  return false;
}

export default function HomePage() {
  const { t } = useLanguage();
  const { matches, loading, error } = useMatchData();
  const sorted = sortByKickoff(matches);
  const nextMatches = getNextMatches(sorted);

  // Find the Final match
  const finalMatch = useMemo(
    () => sorted.find((m) => m.stage === 'Final') ?? null,
    [sorted],
  );

  const isFinalFinished = finalMatch && hasFinalWinner(finalMatch);
  const alreadyShown = useMemo(() => wasCelebrationShown(), []);

  // Celebration flow state machine: 'idle' → 'celebrating' → 'thankyou' → 'done'
  const [phase, setPhase] = useState(() => {
    if (isFinalFinished && alreadyShown) return 'done';
    if (isFinalFinished && !alreadyShown) return 'celebrating';
    return 'idle';
  });

  // When the final becomes finished during the session (via live polling)
  // and we haven't started celebrating yet
  useMemo(() => {
    if (isFinalFinished && phase === 'idle' && !alreadyShown) {
      setPhase('celebrating');
    }
  }, [isFinalFinished, phase, alreadyShown]);

  const handleCelebrationComplete = useCallback(() => {
    setPhase('thankyou');
  }, []);

  const handleThankYouComplete = useCallback(() => {
    setPhase('done');
  }, []);

  const handleViewMatch = useCallback(() => {
    // Scroll to top — the hero already shows the match
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Should we show the 2030 countdown?
  const show2030 = isFinalFinished && phase === 'done';

  if (error) return <main className="section-shell py-24 text-center text-red-300">{error}</main>;
  if (loading) return <HomeLoadingState multiple={nextMatches.length > 1} />;

  const today = sorted.filter((match) => isToday(match.kickoffUTC));
  const upcoming = sorted.filter((match) => match.status === 'live' || new Date(match.kickoffUTC) >= new Date());

  return (
    <main className="home-broadcast pb-20">
      <Hero matches={show2030 ? nextMatches : nextMatches} show2030={show2030} />
      <QuickActions />

      <div className="section-shell mt-12 space-y-8">
        <section>
          <SectionHeader title={t('home.todaysMatches')} linkLabel={t('common.viewAll')} />
          <div className="broadcast-card overflow-hidden rounded-2xl">
            {today.length ? today.map((match) => <HomeMatchRow key={match.id} match={match} />) : (
              <div className="flex min-h-32 flex-col items-center justify-center px-6 py-8 text-center">
                <CalendarOff className="mb-3 text-neon" size={25} />
                <strong className="font-heading text-sm font-black uppercase">{t('home.noMatchesToday')}</strong>
                <span className="mt-1 text-xs text-white/45">{t('home.noMatchesTodayCopy')}</span>
              </div>
            )}
          </div>
        </section>

        <TournamentJourney />
        <UpcomingMatches matches={upcoming} />
      </div>

      {/* Celebration sequence */}
      {phase === 'celebrating' && (
        <WinnerCelebration
          finalMatch={finalMatch}
          onComplete={handleCelebrationComplete}
          onViewMatch={handleViewMatch}
        />
      )}

      {/* Thank-you screen */}
      {phase === 'thankyou' && (
        <ThankYouScreen onComplete={handleThankYouComplete} />
      )}
    </main>
  );
}
