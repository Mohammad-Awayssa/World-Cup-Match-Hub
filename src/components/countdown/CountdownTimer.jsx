import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

function CountdownBox({ value, label }) {
  return (
    <div className="min-w-15 px-2 text-center sm:min-w-24 sm:border-r sm:border-white/10 sm:px-5 last:sm:border-r-0">
      <motion.div key={value} initial={{ opacity: .3, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-3xl font-black tabular-nums tracking-tight sm:text-5xl">
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="mt-1 text-[9px] font-semibold uppercase tracking-[.2em] text-white/55 sm:text-[11px]">{label}</div>
    </div>
  );
}

export function CountdownTimer({ target, status }) {
  const countdown = useCountdown(target);
  if (status === 'live' || countdown.isExpired) {
    return <div className="font-heading text-center text-2xl font-black uppercase tracking-[.12em] text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,.45)]">Live Now</div>;
  }
  return (
    <div aria-live="polite" aria-label="Countdown to next match" className="flex justify-center">
      <CountdownBox value={countdown.days} label="Days" />
      <CountdownBox value={countdown.hours} label="Hours" />
      <CountdownBox value={countdown.minutes} label="Mins" />
      <CountdownBox value={countdown.seconds} label="Secs" />
    </div>
  );
}
