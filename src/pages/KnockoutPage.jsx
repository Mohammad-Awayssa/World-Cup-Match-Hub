import { Building2, Info, Trophy, Users, Waypoints } from 'lucide-react';
import { KnockoutStage } from '../components/group/KnockoutStage';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import backgroundDesktop from '../assets/updatedBGbig.png';
import backgroundMobile from '../assets/updatedBGmobile.png';
import { useLanguage } from '../hooks/useLanguage';

const stats = [
  [Users, '32', 'knockout.teams', 'text-neon'],
  [Building2, '16', 'knockout.venues', 'text-purple-400'],
  [Waypoints, '32', 'knockout.matches', 'text-red-400'],
  [Trophy, '1', 'knockout.champion', 'text-blue-400'],
];

export default function KnockoutPage() {
  const { t } = useLanguage();
  const { matches, loading } = useMatchData();

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
          <h1 className="font-heading mt-3 text-5xl font-black uppercase tracking-[-.045em] sm:text-8xl">{t('knockout.title')}</h1>
          <p className="mt-3 text-sm text-white/55 sm:text-base">{t('knockout.subtitle')}</p>
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

        {loading ? <div className="mt-6"><LoadingCard /></div> : <KnockoutStage matches={matches} />}

        <section className="broadcast-card mt-8 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex gap-3">
            <Info className="mt-0.5 shrink-0 text-white/70" size={20} />
            <div>
              <h2 className="font-heading text-base font-black uppercase">{t('knockout.howWorks')}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">{t('knockout.howWorksCopy')}</p>
            </div>
          </div>
          <span className="shrink-0 text-xs font-semibold text-neon">{t('knockout.oneWinner')}</span>
        </section>
      </div>
    </main>
  );
}
