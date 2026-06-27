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
  CZE: 'cz',
  DEN: 'dk',
  ECU: 'ec',
  EGY: 'eg',
  ENG: 'gb-eng',
  FRA: 'fr',
  GER: 'de',
  GHA: 'gh',
  HAI: 'ht',
  IRN: 'ir',
  JPN: 'jp',
  KOR: 'kr',
  MAR: 'ma',
  MEX: 'mx',
  NED: 'nl',
  NOR: 'no',
  NZL: 'nz',
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

const normalizeStage = (stage = '') => stageAliases[stage] ?? stage;

const kickoffStageKey = (match) => {
  const kickoff = new Date(match.kickoffUTC).getTime();
  if (!Number.isFinite(kickoff)) return null;
  const stage = normalizeStage(match.stage);
  if (!stage || stage === 'Group Stage') return null;
  return `${stage}|${kickoff}`;
};

const hasProviderTeam = (match) => Boolean(match?.homeTeam || match?.awayTeam);

const mergeProviderFields = (localMatch, liveMatch) => {
  const fallbackHasScore = ['live', 'finished'].includes(liveMatch.status);

  return {
    ...localMatch,
    status: liveMatch.status ?? localMatch.status,
    providerStatus: liveMatch.providerStatus ?? null,
    minute: liveMatch.minute ?? null,
    homeTeam: liveMatch.homeTeam || localMatch.homeTeam,
    awayTeam: liveMatch.awayTeam || localMatch.awayTeam,
    homeCode: normalizeProviderCode(liveMatch.homeCode, liveMatch.homeTeam) ?? localMatch.homeCode,
    awayCode: normalizeProviderCode(liveMatch.awayCode, liveMatch.awayTeam) ?? localMatch.awayCode,
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

export const mergeLiveMatches = (
  localMatches,
  liveMatches,
  now = Date.now(),
  { inferScheduledStatus = liveMatches.length > 0 } = {},
) => {
  const liveByTeams = new Map(liveMatches.map((match) => [matchKey(match), match]));
  const liveByKickoffStage = new Map(
    liveMatches
      .filter(hasProviderTeam)
      .map((match) => [kickoffStageKey(match), match])
      .filter(([key]) => key),
  );

  return localMatches.map((localMatch) => {
    const liveMatch = liveByTeams.get(matchKey(localMatch))
      ?? liveByKickoffStage.get(kickoffStageKey(localMatch));
    const merged = liveMatch ? mergeProviderFields(localMatch, liveMatch) : localMatch;

    return {
      ...merged,
      status: inferMatchStatus(merged, now, inferScheduledStatus),
    };
  });
};
