import { CalendarDays, MapPin } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeStage, localizeStadium, localizeTeam } from '../../i18n/entities';
import { formatDisplayScore, getMatchScores } from '../../utils/score';

export function HomeMatchRow({ match, anchorId }) {
  const { language, locale, isArabic, t } = useLanguage();
  const displayScore = formatDisplayScore(match, isArabic);
  const { homePenalties, awayPenalties } = getMatchScores(match);
  const displayPenalties = homePenalties != null && awayPenalties != null
    ? (isArabic ? `${awayPenalties}-${homePenalties}` : `${homePenalties}-${awayPenalties}`)
    : null;
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <article id={anchorId} className={`match-row relative flex scroll-mt-40 flex-col items-center px-4 py-5 text-center sm:px-6 ${isFinished ? 'match-row-finished' : ''}`}>
      <strong className={`mb-3 block text-sm font-bold uppercase tracking-[.08em] ${isLive ? 'text-red-400' : isFinished ? 'text-slate-300' : 'text-white'}`}>
        {isLive ? t('common.live') : isFinished ? t('common.finished') : formatLocalTime(match.kickoffUTC, locale)}
      </strong>

      <div className="grid w-full max-w-3xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <span className="font-heading truncate text-end text-xs font-bold uppercase sm:text-base">{localizeTeam(match.homeTeam, match.homeCode, language)}</span>
          <FlagImage code={match.homeCode} team={localizeTeam(match.homeTeam, match.homeCode, language)} small />
        </div>
        <span dir="ltr" className={`font-heading flex min-w-[3.25rem] flex-col items-center px-1 text-sm font-black leading-none sm:min-w-[3.75rem] sm:px-2 sm:text-base ${isLive ? 'text-red-400' : isFinished ? 'text-slate-200' : 'text-neon'}`}>
          <span>{displayScore ?? 'VS'}</span>
          {displayPenalties && (
            <small className={`mt-1 rounded-full border px-1.5 py-0.5 text-[9px] font-black leading-none sm:text-[10px] ${isFinished ? 'border-neon/25 bg-neon/8 text-neon' : 'border-white/10 bg-white/5 text-white/55'}`}>
              {displayPenalties}
            </small>
          )}
        </span>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <FlagImage code={match.awayCode} team={localizeTeam(match.awayTeam, match.awayCode, language)} small />
          <span className="font-heading truncate text-xs font-bold uppercase sm:text-base">{localizeTeam(match.awayTeam, match.awayCode, language)}</span>
        </div>
      </div>

      <div className={`mt-3 flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs ${isFinished ? 'text-slate-500' : 'text-white/45'}`}>
        <span className={isFinished ? 'text-slate-500' : 'text-neon'}>{match.group ? t('common.group', { group: match.group }) : localizeStage(match.stage, t)}</span>
        <span className="flex items-center gap-1.5"><CalendarDays size={12} />{formatLocalDate(match.kickoffUTC, {}, locale)}</span>
        <span className="flex min-w-0 items-center gap-1.5"><MapPin size={12} className="shrink-0" /><span className="truncate">{localizeStadium(match.stadium, language)}</span></span>
      </div>
    </article>
  );
}
