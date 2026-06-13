import { memo } from 'react';
import { Star } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeTeam } from '../../i18n/entities';

const groupAccents = [
  'text-green-400',
  'text-purple-400',
  'text-yellow-300',
  'text-blue-400',
];

const TeamRow = memo(function TeamRow({ team, index, favorite, onToggle }) {
  const { language, t } = useLanguage();
  const teamName = localizeTeam(team.name, team.code, language);
  return (
    <tr className={`${index < 2 ? 'bg-green-400/[.055]' : index === 2 ? 'bg-yellow-300/[.035]' : ''} border-t border-white/[.055] transition hover:bg-white/[.035]`}>
      <td className="group-team-cell sticky start-0 z-10 bg-[#07111d]/95 px-2 py-3">
        <div className="flex w-40 items-center gap-2 sm:w-44">
          <span className="w-4 text-xs font-semibold text-white/35">{index + 1}</span>
          <FlagImage code={team.code} team={teamName} small />
          <span className="font-heading min-w-0 flex-1 truncate text-xs font-bold sm:text-sm" title={teamName}>{teamName}</span>
          <button onClick={() => onToggle(team.code)} aria-label={t('common.favorite', { team: teamName })} className="grid h-8 min-h-8 w-8 shrink-0 place-items-center text-white/25 transition hover:text-neon">
            <Star size={13} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-neon' : ''} />
          </button>
        </div>
      </td>
      {[team.played, team.won, team.drawn, team.lost, team.goalDifference, team.points].map((value, index) => (
        <td key={index} className={`px-2 text-center text-xs tabular-nums ${index === 5 ? 'font-black text-white' : 'text-white/55'}`}>{value}</td>
      ))}
    </tr>
  );
});

export function GroupCard({ group, favorites, onToggleFavorite, highlighted = false }) {
  const { t } = useLanguage();
  const accent = groupAccents[(group.group.charCodeAt(0) - 65) % groupAccents.length];

  return (
    <article id={`group-${group.group}`} className={`group-standings-card overflow-hidden rounded-2xl ${highlighted ? 'ring-2 ring-neon shadow-[0_0_35px_rgba(200,255,0,.12)]' : ''}`}>
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className={`font-heading text-base font-black uppercase tracking-[.12em] ${accent}`}>{t('common.group', { group: group.group })}</h2>
        <span className="rounded-full border border-white/[.07] bg-white/[.035] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-white/35">{t('groups.standings')}</span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] border-collapse">
          <thead className="text-[9px] font-semibold uppercase tracking-wider text-white/35">
            <tr>
              <th className="group-team-cell sticky start-0 bg-[#07111d] px-3 py-2.5 text-start">{t('groups.team')}</th>
              <th className="px-2">{t('groups.played')}</th>
              <th className="px-2">{t('groups.won')}</th>
              <th className="px-2">{t('groups.drawn')}</th>
              <th className="px-2">{t('groups.lost')}</th>
              <th className="px-2">{t('groups.goalDifference')}</th>
              <th className="px-2">{t('groups.points')}</th>
            </tr>
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
