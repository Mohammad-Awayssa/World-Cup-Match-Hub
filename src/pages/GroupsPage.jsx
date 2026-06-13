import { Info, ShieldCheck, Trophy, Users, Waypoints } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { GroupCard } from '../components/group/GroupCard';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';
import backgroundDesktop from '../assets/updatedBGbig.png';
import backgroundMobile from '../assets/updatedBGmobile.png';
import { useLanguage } from '../hooks/useLanguage';

const stats = [
  [Users, '48', 'groups.teams', 'text-neon'],
  [Waypoints, '12', 'groups.groups', 'text-purple-400'],
  [Trophy, '104', 'groups.matches', 'text-red-400'],
  [ShieldCheck, '32', 'groups.qualify', 'text-blue-400'],
];

export default function GroupsPage() {
  const { t } = useLanguage();
  const { groups, loading } = useMatchData();
  const { favorites, toggleFavorite } = useFavorites();
  const [params] = useSearchParams();
  const highlighted = params.get('group');

  return (
    <main className="groups-broadcast pb-20">
      <section className="relative overflow-hidden border-b border-white/[.06]">
        <picture className="absolute inset-0">
          <source media="(max-width: 639px)" srcSet={backgroundMobile} />
          <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/55 to-[#020814]" />
        <div className="section-shell relative z-10 flex min-h-[350px] flex-col items-center justify-center py-14 text-center sm:min-h-[400px]">
          <p className="font-heading text-xs font-black uppercase tracking-[.2em] text-neon">{t('common.fifaWorldCup')}</p>
          <h1 className="font-heading mt-3 text-6xl font-black uppercase tracking-[-.045em] sm:text-8xl">{t('groups.title')}</h1>
          <p className="mt-3 text-sm text-white/55 sm:text-base">{t('groups.subtitle')}</p>
        </div>
      </section>

      <div className="section-shell -mt-4 relative z-10">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(([Icon, value, labelKey, color]) => (
            <article key={labelKey} className="broadcast-card flex min-h-28 items-center gap-4 rounded-2xl p-4 sm:p-5">
              <Icon className={`${color} shrink-0 drop-shadow-[0_0_10px_currentColor]`} size={29} />
              <div>
                <strong className="font-heading block text-2xl font-black sm:text-3xl">{value}</strong>
                <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/45">{t(labelKey)}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-4 text-xs text-white/55">
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-green-400/40" /> {t('groups.topTwo')}</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-yellow-300/30" /> {t('groups.thirdContention')}</span>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></div>
        ) : (
          <section className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.group} group={group} favorites={favorites} onToggleFavorite={toggleFavorite} highlighted={highlighted === group.group} />
            ))}
          </section>
        )}

        <section className="broadcast-card mt-8 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex gap-3">
            <Info className="mt-0.5 shrink-0 text-white/70" size={20} />
            <div>
              <h2 className="font-heading text-base font-black uppercase">{t('groups.howWorks')}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">{t('groups.howWorksCopy')}</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-neon">{t('groups.advance')}</span>
        </section>
      </div>
    </main>
  );
}
