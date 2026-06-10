import { ShieldQuestion } from 'lucide-react';
import { getFlagUrl } from '../../utils/flagUrl';

export function FlagImage({ code, team, small = false, large = false }) {
  const size = small ? 40 : large ? 160 : 80;
  const dimensions = small ? 'h-7 w-9' : large ? 'h-20 w-28 sm:h-24 sm:w-36' : 'h-12 w-16';
  if (!code) {
    return (
      <span className={`${dimensions} grid shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-text-muted`}>
        <ShieldQuestion size={small ? 17 : 25} aria-label="Placeholder team" />
      </span>
    );
  }
  return (
    <img
      src={getFlagUrl(code, size)}
      alt={`${team} flag`}
      loading="lazy"
      className={`${dimensions} shrink-0 rounded-xl object-cover shadow-lg ring-1 ring-white/15`}
      onError={(event) => { event.currentTarget.style.opacity = '.25'; }}
    />
  );
}
