const teamAliases = {
  'bosnia and herzegovina': 'bosnia herzegovina',
  'bosnia herzegovina': 'bosnia herzegovina',
  'cape verde islands': 'cape verde',
  'congo dr': 'dr congo',
  'cote d ivoire': 'cote d ivoire',
  'czech republic': 'czechia',
  'democratic republic of congo': 'dr congo',
  'dr congo': 'dr congo',
  'ivory coast': 'cote d ivoire',
  'korea republic': 'south korea',
  turkey: 'turkiye',
  turkiye: 'turkiye',
  'united states': 'usa',
  'united states of america': 'usa',
};

const providerCodeMap = {
  ALG: 'dz',
  ARG: 'ar',
  AUS: 'au',
  AUT: 'at',
  BEL: 'be',
  BIH: 'ba',
  BRA: 'br',
  CAN: 'ca',
  CIV: 'ci',
  COL: 'co',
  CPV: 'cv',
  CRO: 'hr',
  CUW: 'cw',
  CZE: 'cz',
  COD: 'cd',
  DEN: 'dk',
  ECU: 'ec',
  EGY: 'eg',
  ENG: 'gb-eng',
  ESP: 'es',
  FRA: 'fr',
  GER: 'de',
  GHA: 'gh',
  HAI: 'ht',
  IRN: 'ir',
  IRQ: 'iq',
  JPN: 'jp',
  JOR: 'jo',
  KOR: 'kr',
  KSA: 'sa',
  MAR: 'ma',
  MLI: 'ml',
  MEX: 'mx',
  NED: 'nl',
  NOR: 'no',
  NZL: 'nz',
  PAN: 'pa',
  PAR: 'py',
  POR: 'pt',
  QAT: 'qa',
  RSA: 'za',
  SCO: 'gb-sct',
  SEN: 'sn',
  SRB: 'rs',
  SUI: 'ch',
  SWE: 'se',
  TUN: 'tn',
  TUR: 'tr',
  URU: 'uy',
  USA: 'us',
  UZB: 'uz',
};

const teamCodeByName = {
  algeria: 'dz',
  argentina: 'ar',
  australia: 'au',
  austria: 'at',
  belgium: 'be',
  'bosnia herzegovina': 'ba',
  brazil: 'br',
  canada: 'ca',
  'cape verde': 'cv',
  colombia: 'co',
  croatia: 'hr',
  czechia: 'cz',
  'dr congo': 'cd',
  ecuador: 'ec',
  egypt: 'eg',
  england: 'gb-eng',
  france: 'fr',
  germany: 'de',
  ghana: 'gh',
  haiti: 'ht',
  iran: 'ir',
  japan: 'jp',
  mexico: 'mx',
  morocco: 'ma',
  netherlands: 'nl',
  paraguay: 'py',
  portugal: 'pt',
  qatar: 'qa',
  scotland: 'gb-sct',
  'south africa': 'za',
  'south korea': 'kr',
  spain: 'es',
  switzerland: 'ch',
  turkiye: 'tr',
  usa: 'us',
};

const stageAliases = {
  LAST_32: 'Round of 32',
  LAST_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter Finals',
  SEMI_FINALS: 'Semi Finals',
  THIRD_PLACE: 'Third Place',
  FINAL: 'Final',
};

const normalizeTeamName = (name = '') => {
  const normalized = String(name ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  return teamAliases[normalized] ?? normalized;
};

const normalizeProviderCode = (code, teamName) => {
  const normalizedCode = String(code ?? '').trim();
  if (normalizedCode) {
    const upperCode = normalizedCode.toUpperCase();
    if (providerCodeMap[upperCode]) return providerCodeMap[upperCode];
    return normalizedCode.toLowerCase().replace('_', '-');
  }

  return teamCodeByName[normalizeTeamName(teamName)] ?? null;
};

const matchKey = (match) => [
  normalizeTeamName(match.homeTeam),
  normalizeTeamName(match.awayTeam),
].join('|');

const extractWinnerMatchNumber = (value = '') => {
  const match = String(value).match(/^Winner Match (\d+)$/);
  return match ? Number(match[1]) : null;
};

const extractLoserMatchNumber = (value = '') => {
  const match = String(value).match(/^Loser Match (\d+)$/);
  return match ? Number(match[1]) : null;
};

const normalizeStage = (stage = '') => stageAliases[stage] ?? stage;

const kickoffStageKey = (match) => {
  const kickoff = new Date(match.kickoffUTC).getTime();
  if (!Number.isFinite(kickoff)) return null;
  const stage = normalizeStage(match.stage);
  if (!stage || stage === 'Group Stage') return null;
  return `${stage}|${kickoff}`;
};

const hasProviderTeam = (match) => Boolean(match?.homeTeam || match?.awayTeam);

const isUndecidedTeamName = (name) => {
  const normalized = normalizeTeamName(name);
  return normalized === 'to be decided'
    || normalized === 'tbd'
    || normalized === 'to be confirmed';
};

const providerTeamName = (liveName, localName) => (
  liveName && !isUndecidedTeamName(liveName) ? liveName : localName
);

const matchNumberKey = (match) => {
  const number = Number(match?.matchNumber);
  return Number.isFinite(number) && number > 0 ? number : null;
};

const buildUniqueMap = (matches, keyForMatch) => {
  const counts = new Map();
  const values = new Map();

  matches.forEach((match) => {
    const key = keyForMatch(match);
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    values.set(key, match);
  });

  return new Map(
    [...values.entries()].filter(([key]) => counts.get(key) === 1),
  );
};

const mergeProviderFields = (localMatch, liveMatch) => {
  const fallbackHasScore = ['live', 'finished'].includes(liveMatch.status);

  return {
    ...localMatch,
    status: liveMatch.status ?? localMatch.status,
    providerStatus: liveMatch.providerStatus ?? null,
    minute: liveMatch.minute ?? null,
    homeTeam: providerTeamName(liveMatch.homeTeam, localMatch.homeTeam),
    awayTeam: providerTeamName(liveMatch.awayTeam, localMatch.awayTeam),
    homeCode: isUndecidedTeamName(liveMatch.homeTeam)
      ? localMatch.homeCode
      : normalizeProviderCode(liveMatch.homeCode, liveMatch.homeTeam) ?? localMatch.homeCode,
    awayCode: isUndecidedTeamName(liveMatch.awayTeam)
      ? localMatch.awayCode
      : normalizeProviderCode(liveMatch.awayCode, liveMatch.awayTeam) ?? localMatch.awayCode,
    homeScore: fallbackHasScore
      ? liveMatch.homeScore ?? localMatch.homeScore
      : localMatch.homeScore,
    awayScore: fallbackHasScore
      ? liveMatch.awayScore ?? localMatch.awayScore
      : localMatch.awayScore,
    homePenalties: fallbackHasScore
      ? liveMatch.homePenalties ?? localMatch.homePenalties
      : localMatch.homePenalties,
    awayPenalties: fallbackHasScore
      ? liveMatch.awayPenalties ?? localMatch.awayPenalties
      : localMatch.awayPenalties,
  };
};

export const inferMatchStatus = (match, now = Date.now(), inferScheduledStatus = true) => {
  if (['finished', 'cancelled', 'postponed', 'suspended'].includes(match.status)) {
    return match.status;
  }

  if (match.status === 'live') return 'live';
  if (!inferScheduledStatus) return match.status ?? 'upcoming';

  const kickoff = new Date(match.kickoffUTC).getTime();
  const assumedMatchEnd = kickoff + (3 * 60 * 60 * 1000);

  if (now >= kickoff && now < assumedMatchEnd) return 'live';
  return match.status ?? 'upcoming';
};

const getLogicalScores = (match) => ({
  homeScore: match?.score?.home ?? match?.homeScore,
  awayScore: match?.score?.away ?? match?.awayScore,
});

const getWinnerSide = (match) => {
  if (!match || match.status !== 'finished') return null;
  const { homeScore, awayScore } = getLogicalScores(match);

  if (homeScore == null || awayScore == null) return null;
  if (homeScore !== awayScore) return homeScore > awayScore ? 'home' : 'away';
  if (match.homePenalties == null || match.awayPenalties == null) return null;
  if (match.homePenalties === match.awayPenalties) return null;
  return match.homePenalties > match.awayPenalties ? 'home' : 'away';
};

const getLoserSide = (match) => {
  if (!match || match.status !== 'finished') return null;
  const { homeScore, awayScore } = getLogicalScores(match);

  if (homeScore == null || awayScore == null) return null;
  if (homeScore !== awayScore) return homeScore < awayScore ? 'home' : 'away';
  if (match.homePenalties == null || match.awayPenalties == null) return null;
  if (match.homePenalties === match.awayPenalties) return null;
  return match.homePenalties < match.awayPenalties ? 'home' : 'away';
};

const teamFromSide = (match, side) => {
  if (!side) return null;
  return {
    team: match[`${side}Team`],
    code: match[`${side}Code`],
  };
};

export const resolveKnockoutParticipants = (matches, baseMatches = matches) => {
  const byNumber = new Map(matches.map((match) => [match.matchNumber, match]));
  const baseByNumber = new Map(baseMatches.map((match) => [match.matchNumber, match]));
  const resolved = new Map();

  const resolveMatch = (match, visiting = new Set()) => {
    if (!match) return null;
    if (resolved.has(match.matchNumber)) return resolved.get(match.matchNumber);
    if (visiting.has(match.matchNumber)) return match;

    visiting.add(match.matchNumber);

    const resolveSlot = (slotName, slotCode) => {
      const rawName = match[slotName];
      const baseName = baseByNumber.get(match.matchNumber)?.[slotName];
      const routeName = isUndecidedTeamName(rawName) && baseName ? baseName : rawName;
      const winnerMatchNumber = extractWinnerMatchNumber(routeName);
      const loserMatchNumber = extractLoserMatchNumber(routeName);
      const sourceNumber = winnerMatchNumber ?? loserMatchNumber;

      if (!sourceNumber) {
        return {
          team: rawName,
          code: match[slotCode],
        };
      }

      const sourceMatch = resolveMatch(byNumber.get(sourceNumber), visiting);
      const side = winnerMatchNumber
        ? getWinnerSide(sourceMatch)
        : getLoserSide(sourceMatch);
      const sourceTeam = teamFromSide(sourceMatch, side);

      return sourceTeam?.team
        ? sourceTeam
        : {
          team: routeName,
          code: match[slotCode],
        };
    };

    const home = resolveSlot('homeTeam', 'homeCode');
    const away = resolveSlot('awayTeam', 'awayCode');
    const next = {
      ...match,
      homeTeam: home.team,
      homeCode: home.code,
      awayTeam: away.team,
      awayCode: away.code,
    };

    visiting.delete(match.matchNumber);
    resolved.set(match.matchNumber, next);
    return next;
  };

  return matches.map((match) => resolveMatch(match));
};

export const mergeLiveMatches = (
  localMatches,
  liveMatches,
  now = Date.now(),
  { inferScheduledStatus = liveMatches.length > 0 } = {},
) => {
  const liveByTeams = new Map(liveMatches.map((match) => [matchKey(match), match]));
  const liveByMatchNumber = buildUniqueMap(liveMatches, matchNumberKey);
  const liveByKickoffStage = buildUniqueMap(
    liveMatches.filter(hasProviderTeam),
    kickoffStageKey,
  );

  return localMatches.map((localMatch) => {
    const liveMatch = liveByTeams.get(matchKey(localMatch))
      ?? liveByMatchNumber.get(matchNumberKey(localMatch))
      ?? liveByKickoffStage.get(kickoffStageKey(localMatch));
    const merged = liveMatch ? mergeProviderFields(localMatch, liveMatch) : localMatch;

    return {
      ...merged,
      status: inferMatchStatus(merged, now, inferScheduledStatus),
    };
  });
};
