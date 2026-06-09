import { memo } from 'react';
import { FlagImage } from '../common/FlagImage';
import { Star } from 'lucide-react';

const TeamRow = memo(function TeamRow({ team, index, favorite, onToggle }) {
  return (
    <tr className={`${index < 2 ? 'bg-green-500/[.07]' : index === 2 ? 'bg-yellow-400/[.04]' : ''} border-t border-white/[.06]`}>
      <td className="sticky left-0 z-10 bg-[#0d0d26]/95 py-3 pl-3 pr-4">
        <div className="flex min-w-44 items-center gap-2">
          <span className="w-4 text-xs text-text-muted">{index + 1}</span>
          <FlagImage code={team.code} team={team.name} small />
          <span className="font-heading truncate text-sm font-semibold">{team.name}</span>
          <button onClick={() => onToggle(team.code)} aria-label={`Favorite ${team.name}`} className="ml-auto grid h-8 min-h-8 w-8 place-items-center text-text-muted hover:text-gold">
            <Star size={14} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-gold' : ''} />
          </button>
        </div>
      </td>
      {[team.played, team.won, team.drawn, team.lost, team.goalDifference, team.points].map((value, i) => (
        <td key={i} className={`px-3 text-center text-xs ${i === 5 ? 'font-bold text-white' : 'text-text-secondary'}`}>{value}</td>
      ))}
    </tr>
  );
});

export function GroupCard({ group, favorites, onToggleFavorite, highlighted = false }) {
  return (
    <article id={`group-${group.group}`} className={`glass overflow-hidden rounded-3xl ${highlighted ? 'ring-2 ring-gold/70' : ''}`}>
      <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[.25em] text-gold">Standings</div>
          <h2 className="font-heading text-xl font-bold">Group {group.group}</h2>
        </div>
        <span className="font-heading text-4xl font-black text-white/[.06]">{group.group}</span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="text-[10px] uppercase tracking-wider text-text-muted">
            <tr><th className="sticky left-0 bg-[#0d0d26] py-3 pl-3 text-left">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {group.teams.map((team, index) => (
              <TeamRow key={team.code} team={team} index={index} favorite={favorites.includes(team.code)} onToggle={onToggleFavorite} />
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
