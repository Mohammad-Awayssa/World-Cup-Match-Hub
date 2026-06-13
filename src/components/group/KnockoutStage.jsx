import { CalendarDays, MapPin, ShieldQuestion, Trophy } from 'lucide-react';
import { formatLocalDate, formatLocalTime } from '../../utils/time';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeCity, localizeStage, localizeStadium, localizeTeam } from '../../i18n/entities';

const stageOrder = [
  'Round of 32',
  'Round of 16',
  'Quarter Finals',
  'Semi Finals',
  'Final',
];

const stageDates = {
  'Round of 32': ['2026-06-28', '2026-07-03'],
  'Round of 16': ['2026-07-04', '2026-07-07'],
  'Quarter Finals': ['2026-07-09', '2026-07-11'],
  'Semi Finals': ['2026-07-14', '2026-07-15'],
  Final: ['2026-07-19', null],
};

const formatShortDate = (date, locale) => new Intl.DateTimeFormat(locale, {
  month: 'short',
  day: 'numeric',
}).format(new Date(date.includes('T') ? date : `${date}T12:00:00Z`));

const formatStageDates = (stage, locale) => stageDates[stage]
  .filter(Boolean)
  .map((date) => formatShortDate(date, locale))
  .join(' - ');

function TeamSlot({ name }) {
  const { language } = useLanguage();
  const localizedName = localizeTeam(name, null, language);

  return (
    <div className="flex min-w-0 items-center gap-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[.04] text-white/35">
        <ShieldQuestion size={13} />
      </span>
      <span className="truncate text-xs font-semibold text-white/80" title={localizedName}>{localizedName}</span>
    </div>
  );
}

function KnockoutMatch({ match }) {
  const { language, locale } = useLanguage();

  return (
    <article className="knockout-match relative rounded-xl p-3" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="font-heading text-xs font-black text-neon">{String(match.matchNumber).padStart(2, '0')}</span>
        <span className="text-end text-[9px] leading-4 text-white/40">
          {formatShortDate(match.kickoffUTC, locale)}<br />
          {formatLocalTime(match.kickoffUTC, locale)}
        </span>
      </div>
      <div className="space-y-2.5">
        <TeamSlot name={match.homeTeam} />
        <TeamSlot name={match.awayTeam} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-white/[.06] pt-2 text-[9px] text-white/35">
        <MapPin size={10} className="shrink-0 text-neon/70" />
        <span className="truncate">{localizeCity(match.city, language)}</span>
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
  const { language, locale, t } = useLanguage();

  return (
    <section className="min-w-52 flex-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="mb-4 text-center">
        <h3 className="font-heading text-xs font-black uppercase tracking-[.08em] text-white">{localizeStage(stage, t)}</h3>
        <p className="mt-1 text-[10px] text-white/40">{formatStageDates(stage, locale)}</p>
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
  const { language, locale, t } = useLanguage();
  const bracketMatches = matches.filter((match) => match.stage !== 'Group Stage' && match.stage !== 'Third Place');
  const thirdPlace = matches.find((match) => match.stage === 'Third Place');

  return (
    <>
      <section className="broadcast-card mt-6 rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <Trophy className="text-neon" size={22} />
          <div>
            <h2 className="font-heading text-lg font-black uppercase">{t('knockout.roadTitle')}</h2>
            <p className="mt-1 text-xs text-white/40">{t('knockout.roadCopy')}</p>
          </div>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stageOrder.map((stage, index) => (
            <div key={stage} className="relative flex items-center gap-3 sm:block sm:text-center">
              {index < stageOrder.length - 1 && <span className="knockout-stage-line absolute start-5 top-10 h-[calc(100%+0.75rem)] border-s border-dashed border-white/15 sm:start-1/2 sm:top-5 sm:h-px sm:w-full sm:border-s-0 sm:border-t" />}
              <span className={`${index === 0 ? 'border-neon/40 bg-neon/15 text-neon' : 'border-white/10 bg-white/[.04] text-white/40'} relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border sm:mx-auto`}>
                {index === stageOrder.length - 1 ? <Trophy size={18} /> : <span className="font-heading text-xs font-black">{32 / (2 ** index)}</span>}
              </span>
              <div className="sm:mt-3">
                <strong className={`${index === 0 ? 'text-neon' : 'text-white/65'} font-heading block text-[10px] font-black uppercase`}>{localizeStage(stage, t)}</strong>
                <span className="text-[9px] text-white/35">{formatStageDates(stage, locale)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto pb-3" dir="ltr">
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
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-neon">{t('knockout.thirdPlace')}</p>
              <h2 className="font-heading mt-1 text-lg font-black uppercase">
                {localizeTeam(thirdPlace.homeTeam, thirdPlace.homeCode, language)} <bdi>VS</bdi> {localizeTeam(thirdPlace.awayTeam, thirdPlace.awayCode, language)}
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-white/50">
              <span className="flex items-center gap-2"><CalendarDays size={14} className="text-neon" />{formatLocalDate(thirdPlace.kickoffUTC, {}, locale)} · {formatLocalTime(thirdPlace.kickoffUTC, locale)}</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-neon" />{localizeStadium(thirdPlace.stadium, language)}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
