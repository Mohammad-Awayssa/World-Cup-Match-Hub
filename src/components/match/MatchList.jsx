import { MatchCard } from './MatchCard';

export function MatchList({ matches, favorites, onToggleFavorite, emptyMessage = 'No matches found.' }) {
  if (!matches.length) {
    return <div className="glass rounded-3xl px-6 py-16 text-center text-text-secondary">{emptyMessage}</div>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} favorites={favorites} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}
