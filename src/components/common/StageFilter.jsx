import { GROUP_LETTERS, STAGES } from '../../constants';

export function StageFilter({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-xl border border-white/10 bg-[#0a1422] px-4 text-sm text-white focus:border-neon/50 focus:outline-none">
      <option value="all">All stages & groups</option>
      {GROUP_LETTERS.map((group) => <option key={group} value={`Group ${group}`}>Group {group}</option>)}
      {STAGES.filter((stage) => stage !== 'Group Stage').map((stage) => <option key={stage}>{stage}</option>)}
    </select>
  );
}
