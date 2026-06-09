import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { MatchList } from '../components/match/MatchList';
import { SearchInput } from '../components/common/SearchInput';
import { StageFilter } from '../components/common/StageFilter';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';
import { filterMatches, sortByKickoff } from '../utils/matchHelpers';

export default function SchedulePage() {
  const { matches, loading } = useMatchData();
  const { favorites, toggleFavorite } = useFavorites();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const filtered = useMemo(() => sortByKickoff(filterMatches(matches, filter, search, favorites, onlyFavorites)), [matches, filter, search, favorites, onlyFavorites]);

  return (
    <PageLayout eyebrow="All 104 matches" title="Full tournament schedule" description={`Kickoff times automatically shown in ${Intl.DateTimeFormat().resolvedOptions().timeZone}. Filter by group or stage, search any team, and star your favorites.`}>
      <div className="glass sticky top-20 z-20 mb-8 flex flex-col gap-3 rounded-2xl p-3 md:flex-row">
        <SearchInput value={search} onChange={setSearch} />
        <StageFilter value={filter} onChange={setFilter} />
        <button onClick={() => setOnlyFavorites(!onlyFavorites)} className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold ${onlyFavorites ? 'border-gold/40 bg-gold/10 text-gold' : 'border-white/10 bg-white/5 text-text-secondary'}`}>
          <Star size={16} fill={onlyFavorites ? 'currentColor' : 'none'} /> My teams
        </button>
      </div>
      <div className="mb-5 flex items-center justify-between text-xs text-text-muted"><span>{filtered.length} matches</span><span>Times are local to you</span></div>
      {loading ? <div className="grid gap-4 md:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></div> : <MatchList matches={filtered} favorites={favorites} onToggleFavorite={toggleFavorite} emptyMessage={onlyFavorites && !favorites.length ? 'Star a team on any match card to build your personal schedule.' : 'No matches match these filters.'} />}
    </PageLayout>
  );
}
