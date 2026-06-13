import { MatchCard } from './MatchCard';
import { useLanguage } from '../../hooks/useLanguage';

export function MatchList({ matches, favorites, onToggleFavorite, emptyMessage }) {
  const { language } = useLanguage();
  if (!matches.length) {
    return <div className="glass rounded-3xl px-6 py-16 text-center text-text-secondary">{emptyMessage ?? (language === 'ar' ? 'لا توجد مباريات.' : 'No matches found.')}</div>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
