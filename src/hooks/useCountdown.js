import { useEffect, useState } from 'react';

const calculate = (target) => {
  const difference = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: difference === 0,
  };
};

export function useCountdown(target) {
  const [time, setTime] = useState(() => calculate(target));
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') setTime(calculate(target));
    };
    const interval = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [target]);
  return time;
}
