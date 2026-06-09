import { memo } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MapPin, Star } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';

function Team({ name, code, favorited, onToggle }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <div className="relative">
        <FlagImage code={code} team={name} />
        {code && (
          <button onClick={() => onToggle(code)} aria-label={`${favorited ? 'Remove' : 'Add'} ${name} ${favorited ? 'from' : 'to'} favorites`} className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#101027] text-text-muted shadow-xl hover:text-gold">
            <Star size={16} fill={favorited ? 'currentColor' : 'none'} className={favorited ? 'text-gold' : ''} />
          </button>
        )}
      </div>
      <span className="font-heading mt-3 line-clamp-2 text-sm font-semibold sm:text-base">{name}</span>
    </div>
  );
}

export const MatchCard = memo(function MatchCard({ match, favorites, onToggleFavorite, featured = false }) {
  const live = match.status === 'live';
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .15 }}
      className={`glass glass-hover relative overflow-hidden rounded-3xl p-5 ${featured ? 'border-gold/30' : ''} ${live ? 'live-glow border-red-500/50' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-px gold-line opacity-60" />
      <div className="mb-5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.17em]">
        <span className="text-gold">{match.group ? `Group ${match.group}` : match.stage}</span>
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-text-muted">Match {match.matchNumber}</span>
      </div>
      <div className="flex items-start gap-3">
        <Team name={match.homeTeam} code={match.homeCode} favorited={favorites.includes(match.homeCode)} onToggle={onToggleFavorite} />
        <div className="font-heading mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-text-secondary">
          {match.homeScore === null ? 'VS' : `${match.homeScore}–${match.awayScore}`}
        </div>
        <Team name={match.awayTeam} code={match.awayCode} favorited={favorites.includes(match.awayCode)} onToggle={onToggleFavorite} />
      </div>
      <div className="mt-6 space-y-2.5 border-t border-white/8 pt-4 text-xs text-text-secondary">
        <p className="flex items-center gap-2"><CalendarDays size={15} className="text-gold" />{formatLocalDate(match.kickoffUTC)}</p>
        <p className="flex items-center gap-2"><Clock3 size={15} className="text-gold" />{formatLocalTime(match.kickoffUTC)}</p>
        <p className="flex items-center gap-2"><MapPin size={15} className="text-gold" />{match.stadium}, {match.city}</p>
      </div>
    </motion.article>
  );
});
