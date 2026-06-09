import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '../countdown/CountdownTimer';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';

export function Hero({ match }) {
  if (!match) return null;
  return (
    <section className="relative min-h-[760px] overflow-hidden border-b border-white/[.06]">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -left-40 top-5 h-[500px] w-[500px] rounded-full bg-mexico-green/20 blur-[100px]" />
      <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-usa-blue/70 blur-[110px]" />
      <div className="section-shell relative z-10 grid min-h-[760px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .7 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[.07] px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-gold"><Sparkles size={14} /> The road to glory</div>
          <h1 className="font-heading text-[clamp(3rem,9vw,5.6rem)] font-black leading-[.88] tracking-[-.055em]">
            ONE WORLD.<br /><span className="gold-text">ONE TROPHY.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">All 104 matches. Three host nations. Every kickoff translated to your local time.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/schedule" className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-bg-deep transition hover:bg-gold-shimmer">Explore schedule <ArrowRight size={17} /></Link>
            <Link to="/groups" className="inline-flex items-center rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">View groups</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .7 }} className="glass relative rounded-[2rem] p-5 sm:p-7">
          <div className="absolute inset-x-10 -top-px h-px gold-line" />
          <div className="mb-6 flex items-center justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-gold">Next kickoff</p><h2 className="font-heading mt-1 text-xl font-bold">{match.group ? `Group ${match.group}` : match.stage}</h2></div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-muted">Match {match.matchNumber}</span>
          </div>
          <div className="flex items-start justify-around gap-4 py-3 text-center">
            <div className="flex max-w-32 flex-col items-center"><FlagImage code={match.homeCode} team={match.homeTeam} /><strong className="font-heading mt-3 text-lg">{match.homeTeam}</strong></div>
            <span className="font-heading mt-5 text-lg font-black text-text-muted">VS</span>
            <div className="flex max-w-32 flex-col items-center"><FlagImage code={match.awayCode} team={match.awayTeam} /><strong className="font-heading mt-3 text-lg">{match.awayTeam}</strong></div>
          </div>
          <div className="my-6 grid gap-2 border-y border-white/[.07] py-4 text-xs text-text-secondary sm:grid-cols-2">
            <span className="flex items-center gap-2"><CalendarDays size={15} className="text-gold" />{formatLocalDate(match.kickoffUTC)} • {formatLocalTime(match.kickoffUTC)}</span>
            <span className="flex items-center gap-2 sm:justify-end"><MapPin size={15} className="text-gold" />{match.city}</span>
          </div>
          <CountdownTimer target={match.kickoffUTC} />
        </motion.div>
      </div>
    </section>
  );
}
