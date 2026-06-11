const FOOTBALL_DATA_URL = 'https://api.football-data.org/v4/competitions/WC/matches';
const WORLDCUP26_URL = 'https://worldcup26.ir/get/games';

const statusMap = {
  SCHEDULED: 'upcoming',
  TIMED: 'upcoming',
  IN_PLAY: 'live',
  PAUSED: 'live',
  FINISHED: 'finished',
  POSTPONED: 'postponed',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
};

const statusPriority = {
  unknown: 0,
  upcoming: 1,
  postponed: 2,
  suspended: 3,
  live: 4,
  finished: 5,
  cancelled: 5,
};

const normalizeFootballDataMatch = (match) => ({
  providerId: String(match.id),
  matchNumber: null,
  kickoffUTC: match.utcDate,
  status: statusMap[match.status] ?? match.status?.toLowerCase() ?? 'unknown',
  providerStatus: match.status,
  minute: match.minute ?? null,
  homeTeam: match.homeTeam?.name ?? null,
  awayTeam: match.awayTeam?.name ?? null,
  homeCode: match.homeTeam?.tla ?? null,
  awayCode: match.awayTeam?.tla ?? null,
  homeScore: match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null,
  awayScore: match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null,
  homePenalties: match.score?.penalties?.home ?? null,
  awayPenalties: match.score?.penalties?.away ?? null,
  group: match.group?.replace('GROUP_', '') ?? null,
  stage: match.stage ?? null,
});

const normalizeWorldCup26Match = (match) => ({
  providerId: String(match.id),
  matchNumber: Number(match.id) || null,
  kickoffUTC: null,
  localDate: match.local_date ?? null,
  status: match.finished === 'TRUE'
    ? 'finished'
    : match.time_elapsed && match.time_elapsed !== 'notstarted'
      ? 'live'
      : 'upcoming',
  providerStatus: match.time_elapsed ?? null,
  minute: Number.parseInt(match.time_elapsed, 10) || null,
  homeTeam: match.home_team_name_en ?? null,
  awayTeam: match.away_team_name_en ?? null,
  homeCode: null,
  awayCode: null,
  homeScore: Number.isNaN(Number(match.home_score)) ? null : Number(match.home_score),
  awayScore: Number.isNaN(Number(match.away_score)) ? null : Number(match.away_score),
  homePenalties: null,
  awayPenalties: null,
  group: match.group ?? null,
  stage: match.type ?? null,
});

const teamAliases = {
  'korea republic': 'south korea',
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

async function fetchFootballData() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error('FOOTBALL_DATA_API_KEY is not configured');
  }

  const response = await fetch(FOOTBALL_DATA_URL, {
    headers: {
      'X-Auth-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`football-data.org returned ${response.status}`);
  }

  const data = await response.json();
  return {
    source: 'football-data.org',
    competition: data.competition?.name ?? 'FIFA World Cup',
    matches: (data.matches ?? []).map(normalizeFootballDataMatch),
  };
}

async function fetchWorldCup26() {
  const response = await fetch(WORLDCUP26_URL);

  if (!response.ok) {
    throw new Error(`worldcup26.ir returned ${response.status}`);
  }

  const data = await response.json();
  return {
    source: 'worldcup26.ir',
    competition: 'FIFA World Cup 2026',
    matches: (data.games ?? []).map(normalizeWorldCup26Match),
  };
}

function mergeMatches(primaryMatches, fallbackMatches) {
  const fallbackByNumber = new Map(
    fallbackMatches.map((match) => [match.matchNumber, match]),
  );
  const fallbackByTeams = new Map(
    fallbackMatches.map((match) => [matchKey(match), match]),
  );

  return primaryMatches.map((primary) => {
    const fallback = fallbackByTeams.get(matchKey(primary))
      ?? fallbackByNumber.get(primary.matchNumber);

    if (!fallback) return primary;

    const fallbackHasNewerStatus =
      (statusPriority[fallback.status] ?? 0) > (statusPriority[primary.status] ?? 0);

    return {
      ...primary,
      matchNumber: fallback.matchNumber ?? primary.matchNumber,
      status: fallbackHasNewerStatus ? fallback.status : primary.status,
      providerStatus: fallbackHasNewerStatus
        ? fallback.providerStatus
        : primary.providerStatus,
      minute: fallback.minute ?? primary.minute,
      homeScore: fallback.homeScore ?? primary.homeScore,
      awayScore: fallback.awayScore ?? primary.awayScore,
      homePenalties: fallback.homePenalties ?? primary.homePenalties,
      awayPenalties: fallback.awayPenalties ?? primary.awayPenalties,
    };
  });
}

async function fetchCombined() {
  const [footballDataResult, worldCup26Result] = await Promise.allSettled([
    fetchFootballData(),
    fetchWorldCup26(),
  ]);

  if (footballDataResult.status === 'fulfilled'
      && worldCup26Result.status === 'fulfilled') {
    return {
      source: 'football-data.org + worldcup26.ir',
      competition: footballDataResult.value.competition,
      matches: mergeMatches(
        footballDataResult.value.matches,
        worldCup26Result.value.matches,
      ),
      providerErrors: [],
    };
  }

  if (footballDataResult.status === 'fulfilled') {
    return {
      ...footballDataResult.value,
      providerErrors: [`worldcup26.ir: ${worldCup26Result.reason.message}`],
    };
  }

  if (worldCup26Result.status === 'fulfilled') {
    return {
      ...worldCup26Result.value,
      providerErrors: [`football-data.org: ${footballDataResult.reason.message}`],
    };
  }

  throw new Error(
    `Both providers failed: ${footballDataResult.reason.message}; ${worldCup26Result.reason.message}`,
  );
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const requestedSource = request.query.source ?? 'auto';

  if (!['auto', 'football-data', 'worldcup26'].includes(requestedSource)) {
    return response.status(400).json({
      error: 'Invalid source. Use auto, football-data, or worldcup26.',
    });
  }

  response.setHeader(
    'Cache-Control',
    'public, s-maxage=20, stale-while-revalidate=40',
  );

  try {
    let result;

    if (requestedSource === 'football-data') {
      result = await fetchFootballData();
    } else if (requestedSource === 'worldcup26') {
      result = await fetchWorldCup26();
    } else {
      result = await fetchCombined();
    }

    return response.status(200).json({
      ...result,
      requestedSource,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return response.status(502).json({
      error: 'Unable to load live scores',
      detail: error.message,
      requestedSource,
      fetchedAt: new Date().toISOString(),
    });
  }
}
