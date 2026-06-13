import { BarChart3, Building2, CalendarDays, Shirt, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const actions = [
  [CalendarDays, 'home.schedule', 'home.allMatches', '/schedule', 'text-neon'],
  [Users, 'home.groups', 'home.viewGroups', '/groups', 'text-purple-400'],
  [BarChart3, 'home.knockout', 'home.roadFinal', '/knockout', 'text-green-400'],
  [Building2, 'home.hostCities', 'home.cities16', '/about', 'text-red-400'],
  [Shirt, 'home.teams', 'home.teams48', '/groups', 'text-blue-400'],
];

export function QuickActions() {
  const { t } = useLanguage();
  return (
    <section aria-label={t('home.quickLinks')} className="section-shell mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map(([Icon, titleKey, subtitleKey, to, color]) => (
        <Link key={titleKey} to={to} className="broadcast-card group flex min-h-36 flex-col items-center justify-center rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:border-neon/30">
          <Icon className={`${color} mb-4 drop-shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-110`} size={31} strokeWidth={2} />
          <strong className="font-heading text-sm font-black uppercase">{t(titleKey)}</strong>
          <span className="mt-1 text-xs text-white/45">{t(subtitleKey)}</span>
        </Link>
      ))}
    </section>
  );
}
