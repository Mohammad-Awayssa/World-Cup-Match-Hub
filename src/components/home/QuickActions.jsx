import { BarChart3, Building2, CalendarDays, Shirt, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  [CalendarDays, 'Schedule', 'All matches', '/schedule', 'text-neon'],
  [Users, 'Groups', 'View groups', '/groups', 'text-purple-400'],
  [BarChart3, 'Knockout', 'Road to the final', '/knockout', 'text-green-400'],
  [Building2, 'Host Cities', '16 cities', '/about', 'text-red-400'],
  [Shirt, 'Teams', '48 teams', '/groups', 'text-blue-400'],
];

export function QuickActions() {
  return (
    <section aria-label="Quick links" className="section-shell mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-5">
      {actions.map(([Icon, title, subtitle, to, color]) => (
        <Link key={title} to={to} className="broadcast-card group flex min-h-36 flex-col items-center justify-center rounded-2xl p-4 text-center transition hover:-translate-y-1 hover:border-neon/30">
          <Icon className={`${color} mb-4 drop-shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-110`} size={31} strokeWidth={2} />
          <strong className="font-heading text-sm font-black uppercase">{title}</strong>
          <span className="mt-1 text-xs text-white/45">{subtitle}</span>
        </Link>
      ))}
    </section>
  );
}
