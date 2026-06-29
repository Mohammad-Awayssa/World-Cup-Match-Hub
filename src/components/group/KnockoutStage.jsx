import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, ShieldQuestion, Trophy } from 'lucide-react';
import { FlagImage } from '../common/FlagImage';
import { formatLocalDate, formatLocalTime } from '../../utils/time';
import { useLanguage } from '../../hooks/useLanguage';
import { localizeCity, localizeStage, localizeStadium, localizeTeam } from '../../i18n/entities';
import matchesDocument from '../../data/matches.json';

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

const CARD_WIDTH = 278;
const CARD_HEIGHT = 138;
const COLUMN_GAP = 104;
const ROW_GAP = 164;
const HEADER_HEIGHT = 64;
const BOARD_PADDING = 18;

const formatShortDate = (date, locale) => new Intl.DateTimeFormat(locale, {
  month: 'short',
  day: 'numeric',
}).format(new Date(date.includes('T') ? date : `${date}T12:00:00Z`));

const formatStageDates = (stage, locale) => stageDates[stage]
  .filter(Boolean)
  .map((date) => formatShortDate(date, locale))
  .join(' - ');

const extractWinnerMatchNumber = (value = '') => {
  const match = String(value).match(/^Winner Match (\d+)$/);
  return match ? Number(match[1]) : null;
};

const isPlaceholderTeam = (name = '') => /^(Winner|Runner-up|Loser|3rd Place)/.test(String(name));

const baseChildrenByMatch = new Map(
  matchesDocument.matches
    .filter((match) => stageOrder.includes(match.stage))
    .map((match) => [
      match.matchNumber,
      [match.homeTeam, match.awayTeam].map(extractWinnerMatchNumber).filter(Boolean),
    ]),
);

const uniqueNumbers = (values) => [...new Set(values.filter(Boolean))];

const buildBracketLayout = (matches, isRtl) => {
  const bracketMatches = matches
    .filter((match) => stageOrder.includes(match.stage))
    .sort((a, b) => a.matchNumber - b.matchNumber);

  const byNumber = new Map(bracketMatches.map((match) => [match.matchNumber, match]));
  const finalMatch = bracketMatches.find((match) => match.stage === 'Final');

  const childrenByMatch = new Map();
  const nextByMatch = new Map();

  bracketMatches.forEach((match) => {
    const currentChildNumbers = [match.homeTeam, match.awayTeam].map(extractWinnerMatchNumber);
    const childNumbers = uniqueNumbers([
      ...currentChildNumbers,
      ...(baseChildrenByMatch.get(match.matchNumber) ?? []),
    ]);
    const children = childNumbers
      .map((number) => byNumber.get(number))
      .filter(Boolean);

    childrenByMatch.set(match.matchNumber, children);
    children.forEach((child) => {
      nextByMatch.set(child.matchNumber, match);
    });
  });

  const collectLeaves = (match, visited = new Set()) => {
    if (!match || visited.has(match.matchNumber)) return [];
    visited.add(match.matchNumber);

    const children = childrenByMatch.get(match.matchNumber) ?? [];
    if (!children.length || match.stage === 'Round of 32') return [match];

    return children.flatMap((child) => collectLeaves(child, visited));
  };

  const orderedLeaves = finalMatch ? collectLeaves(finalMatch) : [];
  const leafNumbers = new Set(orderedLeaves.map((match) => match.matchNumber));
  const remainingLeaves = bracketMatches
    .filter((match) => match.stage === 'Round of 32' && !leafNumbers.has(match.matchNumber));
  const leaves = [...orderedLeaves, ...remainingLeaves];
  const leafIndex = new Map(leaves.map((match, index) => [match.matchNumber, index]));

  const centerCache = new Map();
  const centerForMatch = (match) => {
    if (centerCache.has(match.matchNumber)) return centerCache.get(match.matchNumber);

    const children = childrenByMatch.get(match.matchNumber) ?? [];
    let center;

    if (!children.length || match.stage === 'Round of 32') {
      center = (leafIndex.get(match.matchNumber) ?? 0) * ROW_GAP + CARD_HEIGHT / 2;
    } else {
      const childCenters = children.map(centerForMatch);
      center = childCenters.reduce((sum, value) => sum + value, 0) / childCenters.length;
    }

    centerCache.set(match.matchNumber, center);
    return center;
  };

  const visualStages = isRtl ? [...stageOrder].reverse() : stageOrder;
  const stageX = new Map(
    visualStages.map((stage, index) => [stage, BOARD_PADDING + index * (CARD_WIDTH + COLUMN_GAP)]),
  );

  const positionedMatches = bracketMatches.map((match) => ({
    match,
    x: stageX.get(match.stage),
    y: HEADER_HEIGHT + centerForMatch(match) - CARD_HEIGHT / 2,
    nextMatch: nextByMatch.get(match.matchNumber) ?? null,
  }));

  const byPositionNumber = new Map(
    positionedMatches.map((item) => [item.match.matchNumber, item]),
  );

  const width = (visualStages.length * CARD_WIDTH)
    + ((visualStages.length - 1) * COLUMN_GAP)
    + (BOARD_PADDING * 2);
  const height = HEADER_HEIGHT + Math.max(leaves.length - 1, 0) * ROW_GAP + CARD_HEIGHT + 42;

  const connectors = positionedMatches
    .filter((item) => item.nextMatch)
    .map((item) => {
      const target = byPositionNumber.get(item.nextMatch.matchNumber);
      if (!target) return null;

      const sourceX = isRtl ? item.x : item.x + CARD_WIDTH;
      const targetX = isRtl ? target.x + CARD_WIDTH : target.x;
      const sourceY = item.y + CARD_HEIGHT / 2;
      const targetY = target.y + CARD_HEIGHT / 2;
      const midX = sourceX + (targetX - sourceX) / 2;

      return {
        id: `${item.match.matchNumber}-${target.match.matchNumber}`,
        path: `M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`,
      };
    })
    .filter(Boolean);

  return {
    visualStages,
    positionedMatches,
    connectors,
    width,
    height,
    columnLeft: (stage) => stageX.get(stage),
  };
};

const getLogicalScores = (match) => ({
  homeScore: match?.score?.home ?? match?.homeScore,
  awayScore: match?.score?.away ?? match?.awayScore,
});

const getLoserSide = (match) => {
  if (match.status !== 'finished') return null;
  const { homeScore, awayScore } = getLogicalScores(match);

  if (homeScore == null || awayScore == null) return null;

  if (homeScore !== awayScore) return homeScore < awayScore ? 'home' : 'away';
  if (match.homePenalties == null || match.awayPenalties == null) return null;
  if (match.homePenalties === match.awayPenalties) return null;
  return match.homePenalties < match.awayPenalties ? 'home' : 'away';
};

function TeamSlot({ name, code, score, penalties, muted = false }) {
  const { language } = useLanguage();
  const localizedName = localizeTeam(name, code, language);
  const placeholder = isPlaceholderTeam(name);

  return (
    <div className={`flex min-w-0 items-center gap-2.5 transition ${muted ? 'opacity-45 grayscale' : ''}`}>
      {placeholder ? (
        <span className="grid h-7 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.05] text-white/35">
          <ShieldQuestion size={16} />
        </span>
      ) : (
        <FlagImage code={code} team={localizedName} small />
      )}
      <span className="min-w-0 flex-1 truncate font-heading text-xs font-black uppercase text-white" title={localizedName}>
        {localizedName}
      </span>
      {score != null && (
        <span className="font-heading text-lg font-black tabular-nums text-white">
          {score}
          {penalties != null && <small className="ms-1 text-[10px] text-neon">({penalties})</small>}
        </span>
      )}
    </div>
  );
}

function KnockoutMatchCard({ item, index }) {
  const { language, locale } = useLanguage();
  const { match } = item;
  const isArabic = language === 'ar';
  const { homeScore, awayScore } = getLogicalScores(match);
  const loserSide = getLoserSide(match);

  return (
    <motion.article
      className={`bracket-match-card absolute rounded-2xl p-3.5 ${match.status === 'finished' ? 'bracket-match-card-finished' : ''}`}
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        left: item.x,
        top: item.y,
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.015, 0.25) }}
      whileHover={{ y: -3 }}
      tabIndex={0}
      aria-label={`${localizeTeam(match.homeTeam, match.homeCode, language)} versus ${localizeTeam(match.awayTeam, match.awayCode, language)}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/[.06] pb-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/45">
          <CalendarDays size={11} className="text-neon/80" />
          {formatLocalDate(match.kickoffUTC, { month: 'short', day: 'numeric' }, locale)}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[.04] px-2 py-1 text-[10px] font-bold text-white/65">
          {formatLocalTime(match.kickoffUTC, locale)}
        </span>
      </div>

      <div className="space-y-2">
        <TeamSlot
          name={match.homeTeam}
          code={match.homeCode}
          score={homeScore}
          penalties={match.homePenalties}
          muted={loserSide === 'home'}
        />
        <TeamSlot
          name={match.awayTeam}
          code={match.awayCode}
          score={awayScore}
          penalties={match.awayPenalties}
          muted={loserSide === 'away'}
        />
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-1.5 text-[10px] text-white/38">
        <MapPin size={11} className="shrink-0 text-neon/70" />
        <span className="truncate">
          {localizeStadium(match.stadium, language)}
          {match.city ? `, ${localizeCity(match.city, language)}` : ''}
        </span>
      </div>
    </motion.article>
  );
}

export function KnockoutStage({ matches }) {
  const { language, locale, t } = useLanguage();
  const isRtl = language === 'ar';
  const scrollerRef = useRef(null);
  const [activeStage, setActiveStage] = useState('Round of 32');
  const bracketMatches = useMemo(
    () => matches.filter((match) => match.stage !== 'Group Stage' && match.stage !== 'Third Place'),
    [matches],
  );
  const thirdPlace = matches.find((match) => match.stage === 'Third Place');
  const layout = useMemo(() => buildBracketLayout(bracketMatches, isRtl), [bracketMatches, isRtl]);

  const focusStage = (stage) => {
    setActiveStage(stage);
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const stageLeft = layout.columnLeft(stage);
    scroller.scrollTo({
      left: Math.max(stageLeft - (scroller.clientWidth - CARD_WIDTH) / 2, 0),
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    setActiveStage('Round of 32');
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const stageLeft = layout.columnLeft('Round of 32');
    window.requestAnimationFrame(() => {
      scroller.scrollTo({
        left: Math.max(stageLeft - (scroller.clientWidth - CARD_WIDTH) / 2, 0),
        behavior: 'auto',
      });
    });
  }, [isRtl]);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    if (scroller.scrollLeft <= 2) {
      const edgeStage = layout.visualStages[0];
      if (edgeStage !== activeStage) setActiveStage(edgeStage);
      return;
    }
    if (scroller.scrollLeft >= maxScrollLeft - 2) {
      const edgeStage = layout.visualStages.at(-1);
      if (edgeStage !== activeStage) setActiveStage(edgeStage);
      return;
    }

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    const nearest = layout.visualStages.reduce((closest, stage) => {
      const stageCenter = layout.columnLeft(stage) + CARD_WIDTH / 2;
      const distance = Math.abs(stageCenter - center);
      return distance < closest.distance ? { stage, distance } : closest;
    }, { stage: activeStage, distance: Number.POSITIVE_INFINITY });

    if (nearest.stage !== activeStage) setActiveStage(nearest.stage);
  };

  const moveStage = (direction) => {
    const index = layout.visualStages.indexOf(activeStage);
    const nextIndex = Math.min(Math.max(index + direction, 0), layout.visualStages.length - 1);
    focusStage(layout.visualStages[nextIndex]);
  };

  return (
    <>
      <section className="broadcast-card mt-6 rounded-2xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-3">
            <Trophy className="mt-1 shrink-0 text-neon" size={22} />
            <div>
              <h2 className="font-heading text-lg font-black uppercase">{t('knockout.roadTitle')}</h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">{t('knockout.roadCopy')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveStage(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/65 transition hover:border-neon/50 hover:text-neon focus:outline-none focus:ring-2 focus:ring-neon/50"
              aria-label="Previous round"
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              type="button"
              onClick={() => moveStage(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[.04] text-white/65 transition hover:border-neon/50 hover:text-neon focus:outline-none focus:ring-2 focus:ring-neon/50"
              aria-label="Next round"
            >
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        <nav
          className="mb-5 flex gap-2 overflow-x-auto pb-2"
          aria-label="Knockout rounds"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {stageOrder.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => focusStage(stage)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[.12em] transition focus:outline-none focus:ring-2 focus:ring-neon/50 ${
                activeStage === stage
                  ? 'border-neon/50 bg-neon/15 text-neon shadow-[0_0_24px_rgba(200,255,0,.12)]'
                  : 'border-white/10 bg-white/[.035] text-white/45 hover:border-white/20 hover:text-white'
              }`}
            >
              <span dir={isRtl ? 'rtl' : 'ltr'}>{localizeStage(stage, t)}</span>
            </button>
          ))}
        </nav>

        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="bracket-scroll -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6"
          dir="ltr"
        >
          <div
            className="relative"
            style={{
              width: layout.width,
              height: layout.height,
            }}
          >
            {layout.visualStages.map((stage) => (
              <header
                key={stage}
                className="absolute top-0 text-center"
                style={{
                  width: CARD_WIDTH,
                  transform: `translateX(${layout.columnLeft(stage)}px)`,
                }}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <h3 className="font-heading text-sm font-black uppercase tracking-[.08em] text-white">
                  {localizeStage(stage, t)}
                </h3>
                <p className="mt-1 text-[10px] text-white/38">{formatStageDates(stage, locale)}</p>
              </header>
            ))}

            <svg
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={layout.width}
              height={layout.height}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="knockout-connector" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(200,255,0,.12)" />
                  <stop offset="55%" stopColor="rgba(200,255,0,.72)" />
                  <stop offset="100%" stopColor="rgba(200,255,0,.2)" />
                </linearGradient>
              </defs>
              {layout.connectors.map((connector) => (
                <motion.path
                  key={connector.id}
                  d={connector.path}
                  fill="none"
                  stroke="url(#knockout-connector)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              ))}
            </svg>

            {layout.positionedMatches.map((item, index) => (
              <KnockoutMatchCard key={item.match.id} item={item} index={index} />
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
              <span className="flex items-center gap-2"><CalendarDays size={14} className="text-neon" />{formatLocalDate(thirdPlace.kickoffUTC, {}, locale)} - {formatLocalTime(thirdPlace.kickoffUTC, locale)}</span>
              <span className="flex items-center gap-2"><MapPin size={14} className="text-neon" />{localizeStadium(thirdPlace.stadium, language)}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
