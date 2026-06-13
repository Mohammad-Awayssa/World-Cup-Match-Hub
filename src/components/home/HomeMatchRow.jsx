import { CalendarDays, ChevronRight, MapPin } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';

export function HomeMatchRow({ match, compact = false, anchorId }) {
  const hasScore = Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <article id={anchorId} className={`match-row relative flex scroll-mt-40 flex-col items-center px-4 py-5 text-center sm:px-6 ${isFinished ? 'match-row-finished' : ''}`}>
      <strong className={`mb-3 block text-sm font-bold uppercase tracking-[.08em] ${isLive ? 'text-red-400' : isFinished ? 'text-slate-300' : 'text-white'}`}>
        {isLive ? 'Live' : isFinished ? 'Finished' : formatLocalTime(match.kickoffUTC)}
      </strong>

      <div className="grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <span className="font-heading truncate text-right text-xs font-bold uppercase sm:text-base">{match.homeTeam}</span>
          <FlagImage code={match.homeCode} team={match.homeTeam} small />
        </div>
        <span className={`font-heading px-1 text-sm font-black sm:px-2 sm:text-base ${isLive ? 'text-red-400' : isFinished ? 'text-slate-200' : 'text-neon'}`}>
          {hasScore ? `${match.homeScore}-${match.awayScore}` : 'VS'}
        </span>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <FlagImage code={match.awayCode} team={match.awayTeam} small />
          <span className="font-heading truncate text-xs font-bold uppercase sm:text-base">{match.awayTeam}</span>
        </div>
      </div>

      <div className={`mt-3 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs ${isFinished ? 'text-slate-500' : 'text-white/45'}`}>
        <span className={isFinished ? 'text-slate-500' : 'text-neon'}>{match.group ? `Group ${match.group}` : match.stage}</span>
        <span className="flex items-center gap-1.5"><CalendarDays size={12} />{formatLocalDate(match.kickoffUTC)}</span>
        <span className="flex min-w-0 items-center gap-1.5"><MapPin size={12} className="shrink-0" /><span className="truncate">{match.stadium}</span></span>
      </div>

      {compact && <ChevronRight className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-white/30 lg:block" size={18} />}
    </article>
  );
}
