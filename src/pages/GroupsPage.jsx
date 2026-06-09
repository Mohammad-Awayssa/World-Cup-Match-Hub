import { useSearchParams } from 'react-router-dom';
import { GroupCard } from '../components/group/GroupCard';
import { PageLayout } from '../components/layout/PageLayout';
import { LoadingCard } from '../components/common/LoadingCard';
import { useMatchData } from '../hooks/useMatchData';
import { useFavorites } from '../hooks/useFavorites';

export default function GroupsPage() {
  const { groups, loading } = useMatchData();
  const { favorites, toggleFavorite } = useFavorites();
  const [params] = useSearchParams();
  const highlighted = params.get('group');
  return (
    <PageLayout eyebrow="Group stage" title="Twelve groups. Forty-eight dreams." description="The top two teams in every group qualify automatically, joined by the eight best third-place finishers. Standings are ready for score data when live mode arrives.">
      <div className="mb-7 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-green-500/30" /> Automatic qualification</span>
        <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-yellow-400/20" /> Third-place contention</span>
      </div>
      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2"><LoadingCard /><LoadingCard /></div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map((group) => <GroupCard key={group.group} group={group} favorites={favorites} onToggleFavorite={toggleFavorite} highlighted={highlighted === group.group} />)}
        </div>
      )}
    </PageLayout>
  );
}
