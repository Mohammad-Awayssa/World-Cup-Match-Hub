const teamAliases = {
  'bosnia and herzegovina': 'bosnia herzegovina',
  'bosnia herzegovina': 'bosnia herzegovina',
  'czech republic': 'czechia',
  'korea republic': 'south korea',
  turkey: 'turkiye',
  turkiye: 'turkiye',
  'united states': 'usa',
  'united states of america': 'usa',
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

const matchKey = (match) => [
  normalizeTeamName(match.homeTeam),
  normalizeTeamName(match.awayTeam),
].join('|');

export const inferMatchStatus = (match, now = Date.now()) => {
  if (['finished', 'cancelled', 'postponed', 'suspended'].includes(match.status)) {
    return match.status;
  }

  if (match.status === 'live') return 'live';

  const kickoff = new Date(match.kickoffUTC).getTime();
  const assumedMatchEnd = kickoff + (3 * 60 * 60 * 1000);

  if (now >= kickoff && now < assumedMatchEnd) return 'live';
  return match.status ?? 'upcoming';
};

export const mergeLiveMatches = (localMatches, liveMatches, now = Date.now()) => {
  const liveByTeams = new Map(liveMatches.map((match) => [matchKey(match), match]));

  return localMatches.map((localMatch) => {
    const liveMatch = liveByTeams.get(matchKey(localMatch));
    const merged = liveMatch
      ? {
          ...localMatch,
          status: liveMatch.status ?? localMatch.status,
          providerStatus: liveMatch.providerStatus ?? null,
          minute: liveMatch.minute ?? null,
          homeScore: liveMatch.homeScore ?? localMatch.homeScore,
          awayScore: liveMatch.awayScore ?? localMatch.awayScore,
          homePenalties: liveMatch.homePenalties ?? localMatch.homePenalties,
          awayPenalties: liveMatch.awayPenalties ?? localMatch.awayPenalties,
        }
      : localMatch;

    return {
      ...merged,
      status: inferMatchStatus(merged, now),
    };
  });
};
