import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import { CountdownTimer } from '../countdown/CountdownTimer';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';
import backgroundDesktop from '../../assets/updatedBGbig.png';
import backgroundMobile from '../../assets/updatedBGmobile.png';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeCity, localizeStadium, localizeTeam } from '../../i18n/entities';
import { formatDisplayScore } from '../../utils/score';
import HeroShare from './HeroShare';

export function Hero({ match }) {
  const { language, locale, isArabic, t } = useLanguage();
  const cardRef = useRef(null);
  if (!match) return null;
  const isLive = match.status === 'live';
  const displayScore = formatDisplayScore(match, isArabic);
  const homeName = localizeTeam(match.homeTeam, match.homeCode, language);
  const awayName = localizeTeam(match.awayTeam, match.awayCode, language);
  const matchDate = formatLocalDate(match.kickoffUTC, {}, locale);
  const matchTime = formatLocalTime(match.kickoffUTC, locale);

  return (
    <section className="relative overflow-hidden border-b border-white/[.06]">
      <picture className="absolute inset-0">
        <source media="(max-width: 639px)" srcSet={backgroundMobile} />
        <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/25 to-[#020814]" />

      <div className="section-shell relative z-10 flex min-h-[650px] flex-col items-center justify-center py-10 sm:min-h-[700px] sm:py-14">
        <motion.div ref={cardRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="match-hero-card relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] px-4 pb-5 pt-7 sm:px-10 sm:pb-7">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-neon sm:w-12" />
            <p className={`font-heading text-xs font-black uppercase tracking-[.18em] ${isLive ? 'text-red-400' : 'text-neon'}`}>{isLive ? t('home.matchInProgress') : t('home.nextMatch')}</p>
            <span className="h-px w-8 bg-neon sm:w-12" />
          </div>

          <CountdownTimer target={match.kickoffUTC} status={match.status} />

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center sm:mt-10 sm:gap-8">
            <div className="flex min-w-0 flex-col items-center">
              <FlagImage code={match.homeCode} team={homeName} large />
              <strong className="font-heading mt-4 text-lg font-black uppercase leading-tight sm:text-2xl">{homeName}</strong>
            </div>
            <span
              dir="ltr"
              className={`font-heading text-4xl font-black text-neon sm:text-6xl ${displayScore == null ? 'vs-brush italic' : 'not-italic'}`}
            >
              {displayScore ?? 'VS'}
            </span>
            <div className="flex min-w-0 flex-col items-center">
              <FlagImage code={match.awayCode} team={awayName} large />
              <strong className="font-heading mt-4 text-lg font-black uppercase leading-tight sm:text-2xl">{awayName}</strong>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-5 text-xs text-white/75 sm:flex-row sm:gap-5 sm:text-sm">
            <span className="flex items-center gap-2"><CalendarDays size={16} className="text-neon" />{matchDate}</span>
            <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-neon" />{matchTime}</span>
            <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
            <span className="flex items-center gap-2 text-center"><MapPin size={16} className="shrink-0 text-neon" />{localizeStadium(match.stadium, language)}، {localizeCity(match.city, language)}</span>
          </div>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[.2em] text-white/35">
            worldcupmatches.online
          </p>
        </motion.div>
        <HeroShare
          cardRef={cardRef}
          homeName={homeName}
          awayName={awayName}
          matchDate={matchDate}
          matchTime={matchTime}
        />
      </div>
    </section>
  );
}
