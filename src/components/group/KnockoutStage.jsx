import { CalendarDays, MapPin, ShieldQuestion, Trophy } from 'lucide-react';
import { formatLocalDate, formatLocalTime } from '../../utils/time';

const stageOrder = [
  'Round of 32',
  'Round of 16',
  'Quarter Finals',
  'Semi Finals',
  'Final',
];

const stageDates = {
  'Round of 32': 'Jun 28 - Jul 03',
  'Round of 16': 'Jul 04 - Jul 07',
  'Quarter Finals': 'Jul 09 - Jul 11',
  'Semi Finals': 'Jul 14 - Jul 15',
  Final: 'Jul 19',
};

const formatKnockoutDate = (iso) => new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
}).format(new Date(iso));

function TeamSlot({ name }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-white/35">
        <ShieldQuestion size={13} />
      </span>
      <span className="truncate text-xs font-semibold text-white/80" title={name}>{name}</span>
    </div>
  );
}

function KnockoutMatch({ match }) {
  return (
    <article className="knockout-match relative rounded-xl p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="font-heading text-xs font-black text-neon">{String(match.matchNumber).padStart(2, '0')}</span>
        <span className="text-right text-[9px] leading-4 text-white/40">
          {formatKnockoutDate(match.kickoffUTC)}<br />
          {formatLocalTime(match.kickoffUTC)}
        </span>
      </div>
      <div className="space-y-2.5">
        <TeamSlot name={match.homeTeam} />
        <TeamSlot name={match.awayTeam} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-white/[.06] pt-2 text-[9px] text-white/35">
        <MapPin size={10} className="shrink-0 text-neon/70" />
        <span className="truncate">{match.city}</span>
      </div>
    </article>
  );
}

const rowSpanClasses = {
  'Round of 32': 'row-span-1',
  'Round of 16': 'row-span-2',
  'Quarter Finals': 'row-span-4',
  'Semi Finals': 'row-span-8',
  Final: 'row-span-16',
};

function StageColumn({ stage, matches }) {
  return (
    <section className="min-w-52 flex-1">
      <header className="mb-4 text-center">
        <h3 className="font-heading text-xs font-black uppercase tracking-[.08em] text-white">{stage}</h3>
        <p className="mt-1 text-[10px] text-white/40">{stageDates[stage]}</p>
      </header>
      <div className="grid h-[2080px] grid-rows-[repeat(16,minmax(0,1fr))] gap-2">
        {matches.map((match) => (
          <div key={match.id} className={`${rowSpanClasses[stage]} flex items-center`}>
            <KnockoutMatch match={match} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function KnockoutStage({ matches }) {
  const bracketMatches = matches.filter((match) => match.stage !== 'Group Stage' && match.stage !== 'Third Place');
  const thirdPlace = matches.find((match) => match.stage === 'Third Place');

  return (
    <>
      <section className="broadcast-card mt-6 rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="text-neon" size={22} />
          <div>
            <h2 className="font-heading text-lg font-black uppercase">Road to the Final</h2>
            <p className="mt-1 text-xs text-white/40">Single elimination. Every match decides who moves forward.</p>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stageOrder.map((stage, index) => (
            <div key={stage} className="relative flex items-center gap-3 sm:block sm:text-center">
              {index < stageOrder.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%+0.75rem)] border-l border-dashed border-white/15 sm:left-1/2 sm:top-5 sm:h-px sm:w-full sm:border-l-0 sm:border-t" />}
              <span className={`${index === 0 ? 'border-neon/40 bg-neon/15 text-neon' : 'border-white/10 bg-white/[.04] text-white/40'} relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border sm:mx-auto`}>
                {index === stageOrder.length - 1 ? <Trophy size={18} /> : <span className="font-heading text-xs font-black">{32 / (2 ** index)}</span>}
              </span>
              <div className="sm:mt-3">
                <strong className={`${index === 0 ? 'text-neon' : 'text-white/65'} font-heading block text-[10px] font-black uppercase`}>{stage}</strong>
                <span className="text-[9px] text-white/35">{stageDates[stage]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto pb-3">
          <div className="grid min-w-[1180px] grid-cols-[1.6fr_1.2fr_1fr_.9fr_.9fr] gap-4">
            {stageOrder.map((stage) => (
              <StageColumn key={stage} stage={stage} matches={bracketMatches.filter((match) => match.stage === stage)} />
            ))}
          </div>
        </div>
      </section>

      {thirdPlace && (
        <section className="broadcast-card mt-4 rounded-2xl p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-neon">Third Place Playoff</p>
              <h2 className="font-heading mt-1 text-lg font-black uppercase">{thirdPlace.homeTeam} vs {thirdPlace.awayTeam}</h2>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-white/50">
              <span className="flex items-center gap-2"><CalendarDays size={14} className="text-neon" />{formatLocalDate(thirdPlace.kickoffUTC)} · {formatLocalTime(thirdPlace.kickoffUTC)}</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-neon" />{thirdPlace.stadium}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
