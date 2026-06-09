import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

function CountdownBox({ value, label }) {
  return (
    <div className="min-w-16 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-center shadow-inner sm:min-w-20 sm:px-5">
      <motion.div key={value} initial={{ opacity: .3, y: -5 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-2xl font-extrabold tabular-nums sm:text-4xl">
        {String(value).padStart(2, '0')}
      </motion.div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[.2em] text-text-muted">{label}</div>
    </div>
  );
}

export function CountdownTimer({ target }) {
  const countdown = useCountdown(target);
  if (countdown.isExpired) {
    return <div className="font-heading text-2xl font-bold text-gold">The tournament is underway</div>;
  }
  return (
    <div aria-live="polite" aria-label="Countdown to next match" className="flex flex-wrap justify-center gap-2 sm:gap-3">
      <CountdownBox value={countdown.days} label="Days" />
      <CountdownBox value={countdown.hours} label="Hours" />
      <CountdownBox value={countdown.minutes} label="Mins" />
      <CountdownBox value={countdown.seconds} label="Secs" />
    </div>
  );
}
