import { Flag, MapPinned, Trophy, Users } from 'lucide-react';

const stats = [
  [Trophy, '104', 'Total matches'],
  [Users, '48', 'Teams'],
  [MapPinned, '16', 'Venues'],
  [Flag, '3', 'Host nations'],
];

export function TournamentStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(([Icon,value,label]) => (
        <div key={label} className="glass rounded-2xl p-5">
          <Icon className="mb-5 text-gold" size={22} />
          <strong className="font-heading block text-3xl font-black">{value}</strong>
          <span className="text-xs uppercase tracking-[.14em] text-text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
