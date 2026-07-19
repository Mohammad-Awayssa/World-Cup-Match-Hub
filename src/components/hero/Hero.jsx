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

/* ── 2030 World Cup info ── */
const WC_2030_KICKOFF = '2030-06-13T00:00:00.000Z';
const WC_2030_HOSTS = 'Morocco, Spain & Portugal';

function FinalBadge() {
  return (
    <div className="final-badge mb-3">
      <span className="final-badge-text">🏆 FINAL</span>
    </div>
  );
}

function HeroFixture({ match, multiple, language, locale, isArabic }) {
  const displayScore = formatDisplayScore(match, isArabic);
  const homeName = localizeTeam(match.homeTeam, match.homeCode, language);
  const awayName = localizeTeam(match.awayTeam, match.awayCode, language);

  return (
    <article className={`flex h-full flex-col ${multiple ? 'rounded-2xl border border-white/10 bg-white/[.025] px-4 py-6 sm:px-6' : ''}`}>
      <div className={`grid grid-cols-[1fr_auto_1fr] items-center text-center ${multiple ? 'gap-2 sm:gap-4' : 'gap-3 sm:gap-8'}`}>
        <div className="flex min-w-0 flex-col items-center">
          <FlagImage code={match.homeCode} team={homeName} large />
          <strong className={`font-heading mt-4 font-black uppercase leading-tight ${multiple ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'}`}>
            {homeName}
          </strong>
        </div>

        <span
          dir="ltr"
          className={`font-heading font-black text-neon ${multiple ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-6xl'} ${displayScore == null ? 'vs-brush italic' : 'not-italic'}`}
        >
          {displayScore ?? 'VS'}
        </span>

        <div className="flex min-w-0 flex-col items-center">
          <FlagImage code={match.awayCode} team={awayName} large />
          <strong className={`font-heading mt-4 font-black uppercase leading-tight ${multiple ? 'text-base sm:text-xl' : 'text-lg sm:text-2xl'}`}>
            {awayName}
          </strong>
        </div>
      </div>

      <div className={`mt-8 flex flex-wrap items-center justify-center border-t border-white/10 pt-5 text-center text-white/75 ${multiple ? 'gap-x-4 gap-y-2 text-[11px] sm:text-xs' : 'gap-3 text-xs sm:gap-5 sm:text-sm'}`}>
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="text-neon" />
          {formatLocalDate(match.kickoffUTC, {}, locale)}
        </span>
        <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
        <span className="flex items-center gap-2">
          <Clock3 size={16} className="text-neon" />
          {formatLocalTime(match.kickoffUTC, locale)}
        </span>
        <i className="hidden h-1 w-1 rounded-full bg-neon sm:block" />
        <span className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-neon" />
          {localizeStadium(match.stadium, language)}, {localizeCity(match.city, language)}
        </span>
      </div>
    </article>
  );
}

/* ── 2030 Countdown Card ── */
function Hero2030() {
  return (
    <div className="hero-fade-enter flex flex-col items-center text-center">
      <div className="final-badge mb-4">
        <span className="final-badge-text">🌍 NEXT WORLD CUP</span>
      </div>

      <div className="mb-6 flex items-center justify-center gap-4">
        <span className="h-px w-8 bg-neon sm:w-12" />
        <p className="font-heading text-center text-xs font-black uppercase tracking-[.18em] text-neon">
          Next World Cup
        </p>
        <span className="h-px w-8 bg-neon sm:w-12" />
      </div>

      <CountdownTimer target={WC_2030_KICKOFF} status="upcoming" />

      <h2 className="font-heading mt-8 text-2xl font-black uppercase sm:text-3xl">
        FIFA World Cup 2030
      </h2>

      <p className="mt-3 text-sm text-white/55">
        {WC_2030_HOSTS}
      </p>

      <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[.2em] text-white/35">
        worldcupmatches.online
      </p>
    </div>
  );
}

export function Hero({ matches = [], show2030 = false }) {
  const { language, locale, isArabic, t } = useLanguage();

  // 2030 mode
  if (show2030) {
    return (
      <section className="relative overflow-hidden border-b border-white/[.06]">
        <picture className="absolute inset-0">
          <source media="(max-width: 639px)" srcSet={backgroundMobile} />
          <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/25 to-[#020814]" />

        <div className="section-shell relative z-10 flex min-h-[650px] flex-col items-center justify-center py-10 sm:min-h-[700px] sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .55 }}
            className="match-hero-card relative w-full overflow-hidden rounded-[1.75rem] px-4 pb-5 pt-7 sm:px-8 sm:pb-7 max-w-3xl sm:px-10"
          >
            <Hero2030 />
          </motion.div>
        </div>
      </section>
    );
  }

  if (!matches.length) return null;

  const multiple = matches.length > 1;
  const isLive = matches.some((match) => match.status === 'live');
  const isFinal = matches.some((match) => match.stage === 'Final');
  const title = isLive
    ? t(multiple ? 'home.matchesInProgress' : 'home.matchInProgress')
    : t(multiple ? 'home.nextMatches' : 'home.nextMatch');

  return (
    <section className="relative overflow-hidden border-b border-white/[.06]">
      <picture className="absolute inset-0">
        <source media="(max-width: 639px)" srcSet={backgroundMobile} />
        <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/25 to-[#020814]" />

      <div className="section-shell relative z-10 flex min-h-[650px] flex-col items-center justify-center py-10 sm:min-h-[700px] sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55 }}
          className={`match-hero-card relative w-full overflow-hidden rounded-[1.75rem] px-4 pb-5 pt-7 sm:px-8 sm:pb-7 ${multiple ? 'max-w-6xl' : 'max-w-3xl sm:px-10'}`}
        >
          {/* Final badge */}
          {isFinal && (
            <div className="mb-2 flex justify-center">
              <FinalBadge />
            </div>
          )}

          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-neon sm:w-12" />
            <p className={`font-heading text-center text-xs font-black uppercase tracking-[.18em] ${isLive ? 'text-red-400' : 'text-neon'}`}>
              {title}
            </p>
            <span className="h-px w-8 bg-neon sm:w-12" />
          </div>

          <CountdownTimer
            target={matches[0].kickoffUTC}
            status={isLive ? 'live' : matches[0].status}
          />

          <div className={`mt-8 grid grid-cols-1 gap-4 sm:mt-10 ${multiple ? 'md:grid-cols-2' : ''}`}>
            {matches.map((match) => (
              <HeroFixture
                key={match.id}
                match={match}
                multiple={multiple}
                language={language}
                locale={locale}
                isArabic={isArabic}
              />
            ))}
          </div>

          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[.2em] text-white/35">
            worldcupmatches.online
          </p>
        </motion.div>
      </div>
    </section>
  );
}
