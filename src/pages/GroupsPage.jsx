import { useState } from 'react';
import { Building2, Info, ShieldCheck, Trophy, Users, Waypoints } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { GroupCard } from '../components/group/GroupCard';
import { KnockoutStage } from '../components/group/KnockoutStage';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';
import backgroundDesktop from '../assets/updatedBGbig.png';
import backgroundMobile from '../assets/updatedBGmobile.png';

const groupStats = [
  [Users, '48', 'Teams', 'text-neon'],
  [Waypoints, '12', 'Groups', 'text-purple-400'],
  [Trophy, '104', 'Matches', 'text-red-400'],
  [ShieldCheck, '32', 'Qualify', 'text-blue-400'],
];

const knockoutStats = [
  [Users, '32', 'Teams', 'text-neon'],
  [Building2, '16', 'Venues', 'text-purple-400'],
  [Waypoints, '64', 'Matches', 'text-red-400'],
  [Trophy, '1', 'Champion', 'text-blue-400'],
];

function GroupsHero({ activeStage, onStageChange }) {
  const knockout = activeStage === 'knockout';

  return (
    <section className="relative overflow-hidden border-b border-white/[.06]">
      <picture className="absolute inset-0">
        <source media="(max-width: 639px)" srcSet={backgroundMobile} />
        <img src={backgroundDesktop} alt="" className="h-full w-full object-cover object-top" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-b from-[#020814]/20 via-[#020814]/55 to-[#020814]" />

      <div className="section-shell relative z-10 flex min-h-[390px] flex-col items-center justify-center py-14 text-center sm:min-h-[430px]">
        <p className="font-heading text-xs font-black uppercase tracking-[.2em] text-neon">FIFA World Cup 2026</p>
        <h1 className="font-heading mt-3 text-5xl font-black uppercase tracking-[-.045em] sm:text-8xl">
          {knockout ? 'Knockout Stage' : 'Groups'}
        </h1>
        <p className="mt-3 text-sm text-white/55 sm:text-base">{knockout ? '32 teams. Single elimination.' : '48 teams. 12 groups. One dream.'}</p>

        <div className="mt-8 inline-flex rounded-full border border-white/10 bg-[#050d18]/80 p-1">
          <button onClick={() => onStageChange('groups')} className={`rounded-full px-7 py-3 text-xs font-black uppercase tracking-[.08em] transition sm:px-14 ${!knockout ? 'border border-neon/20 bg-neon/10 text-neon' : 'text-white/35 hover:text-white'}`}>Group Stage</button>
          <button onClick={() => onStageChange('knockout')} className={`rounded-full px-7 py-3 text-xs font-black uppercase tracking-[.08em] transition sm:px-14 ${knockout ? 'border border-neon/20 bg-neon/10 text-neon' : 'text-white/35 hover:text-white'}`}>Knockout Stage</button>
        </div>
      </div>
    </section>
  );
}

function StatsGrid({ stats }) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([Icon, value, label, color]) => (
        <article key={label} className="broadcast-card flex min-h-28 items-center gap-4 rounded-2xl p-4 sm:p-5">
          <Icon className={`${color} shrink-0 drop-shadow-[0_0_10px_currentColor]`} size={29} />
          <div>
            <strong className="font-heading block text-2xl font-black sm:text-3xl">{value}</strong>
            <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/45">{label}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function HowItWorks({ knockout }) {
  return (
    <section className="broadcast-card mt-8 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex gap-3">
        <Info className="mt-0.5 shrink-0 text-white/70" size={20} />
        <div>
          <h2 className="font-heading text-base font-black uppercase">How it works</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            {knockout
              ? 'The 32 qualified teams compete in single-elimination matches. Winners advance through each round until one nation is crowned world champion.'
              : 'The 48 teams are drawn into 12 groups of four. The top two teams from each group, plus the eight best third-placed teams, advance to the Round of 32.'}
          </p>
        </div>
      </div>
      <span className="shrink-0 text-xs font-semibold text-neon">{knockout ? 'One match. One winner.' : '32 teams advance'}</span>
    </section>
  );
}

export default function GroupsPage() {
  const { groups, matches, loading } = useMatchData();
  const { favorites, toggleFavorite } = useFavorites();
  const [params] = useSearchParams();
  const [activeStage, setActiveStage] = useState('groups');
  const highlighted = params.get('group');
  const knockout = activeStage === 'knockout';

  return (
    <main className="groups-broadcast pb-20">
      <GroupsHero activeStage={activeStage} onStageChange={setActiveStage} />

      <div className="section-shell -mt-4 relative z-10">
        <StatsGrid stats={knockout ? knockoutStats : groupStats} />

        {!knockout && (
          <>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-white/55">
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-green-400/40" /> Top two qualify automatically</span>
              <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-yellow-300/30" /> Third-place contention</span>
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
          </>
        )}

        {knockout && !loading && <KnockoutStage matches={matches} />}
        {knockout && loading && <div className="mt-6"><LoadingCard /></div>}

        <HowItWorks knockout={knockout} />
      </div>
    </main>
  );
}
