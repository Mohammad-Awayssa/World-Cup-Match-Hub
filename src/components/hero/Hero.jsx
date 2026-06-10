import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import { CountdownTimer } from '../countdown/CountdownTimer';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';
import backgroundDesktop from '../../assets/updatedBGbig.png';
import backgroundMobile from '../../assets/updatedBGmobile.png';

export function Hero({ match }) {
  if (!match) return null;

  return (
    <section className="relative overflow-hidden border-b border-white/[.06]">
      <picture className="absolute inset-0">
        <source media="(max-width: 639px)" srcSet={backgroundMobile} />
        <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/25 to-[#020814]" />

      <div className="section-shell relative z-10 flex min-h-[650px] items-center justify-center py-10 sm:min-h-[700px] sm:py-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="match-hero-card relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] px-4 pb-5 pt-7 sm:px-10 sm:pb-7">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-neon sm:w-12" />
            <p className="font-heading text-xs font-black uppercase tracking-[.18em] text-neon">Next Match</p>
            <span className="h-px w-8 bg-neon sm:w-12" />
          </div>

          <CountdownTimer target={match.kickoffUTC} />

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center sm:mt-10 sm:gap-8">
            <div className="flex min-w-0 flex-col items-center">
              <FlagImage code={match.homeCode} team={match.homeTeam} large />
              <strong className="font-heading mt-4 text-lg font-black uppercase leading-tight sm:text-2xl">{match.homeTeam}</strong>
            </div>
            <span className="vs-brush font-heading text-4xl font-black italic text-neon sm:text-6xl">VS</span>
            <div className="flex min-w-0 flex-col items-center">
              <FlagImage code={match.awayCode} team={match.awayTeam} large />
              <strong className="font-heading mt-4 text-lg font-black uppercase leading-tight sm:text-2xl">{match.awayTeam}</strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-5 text-xs text-white/75 sm:flex-row sm:gap-5 sm:text-sm">
            <span className="flex items-center gap-2"><CalendarDays size={16} className="text-neon" />{formatLocalDate(match.kickoffUTC)}</span>
            <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-neon" />{formatLocalTime(match.kickoffUTC)}</span>
            <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
            <span className="flex items-center gap-2 text-center"><MapPin size={16} className="shrink-0 text-neon" />{match.stadium}, {match.city}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
