import { ChevronRight } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';

export function HomeMatchRow({ match, compact = false }) {
  const hasScore = Number.isFinite(match.homeScore) && Number.isFinite(match.awayScore);
  const isLive = match.status === 'live';

  return (
    <article className={`match-row grid items-center gap-3 px-4 py-4 sm:px-6 ${compact ? 'lg:grid-cols-[150px_1fr_150px_24px]' : 'lg:grid-cols-[120px_1fr_180px]'}`}>
      <div className="border-white/10 lg:border-r">
        <strong className={`block text-sm font-bold ${isLive ? 'text-red-400' : 'text-white'}`}>
          {isLive ? 'LIVE' : match.status === 'finished' ? 'FT' : formatLocalTime(match.kickoffUTC)}
        </strong>
        <span className="mt-1 block text-xs text-neon">{match.group ? `Group ${match.group}` : match.stage}</span>
        {compact && <span className="mt-1 block text-[11px] text-white/45">{formatLocalDate(match.kickoffUTC)}</span>}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <span className="font-heading truncate text-right text-xs font-bold uppercase sm:text-base">{match.homeTeam}</span>
          <FlagImage code={match.homeCode} team={match.homeTeam} small />
        </div>
        <span className={`font-heading px-1 text-sm font-black sm:px-2 sm:text-base ${isLive ? 'text-red-400' : 'text-neon'}`}>
          {hasScore ? `${match.homeScore}-${match.awayScore}` : 'VS'}
        </span>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <FlagImage code={match.awayCode} team={match.awayTeam} small />
          <span className="font-heading truncate text-xs font-bold uppercase sm:text-base">{match.awayTeam}</span>
        </div>
      </div>

      <span className="hidden truncate text-right text-xs text-white/45 lg:block">{match.stadium}</span>
      {compact && <ChevronRight className="hidden text-white/45 lg:block" size={18} />}
    </article>
  );
}
