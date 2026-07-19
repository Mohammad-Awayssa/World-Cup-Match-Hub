import matchesDocument from '../../data/matches.json';
import groups from '../../data/groups.json';
import stadiums from '../../data/stadiums.json';
import { mergeLiveMatches } from '../../utils/liveMatches';

const clone = (value) => structuredClone(value);
const matches = matchesDocument.matches;

const getBaseMatches = () => mergeLiveMatches(matches, [], Date.now(), {
  inferScheduledStatus: false,
});

const getMatchesWithLiveData = async () => {
  const fetchLiveScores = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Live scores returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.matches) || !data.matches.length) {
      throw new Error('Live scores returned no matches');
    }
    return data.matches;
  };

  const matchesFromLocalApi = await fetchLiveScores('/api/live-scores').catch(async () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return fetchLiveScores('https://worldcupmatches.online/api/live-scores');
    }
    throw new Error('Live scores returned invalid data');
  });

  return mergeLiveMatches(matches, matchesFromLocalApi);
};

export const localAdapter = {
  getAllMatches: async () => clone(getBaseMatches()),
  getLiveMatches: async () => clone(getBaseMatches()),
  getScheduleMetadata: async () => clone({
    lastUpdated: matchesDocument.lastUpdated,
    source: matchesDocument.source,
  }),
  getMatchById: async (id) => clone(matches.find((match) => match.id === Number(id))),
  getMatchesByStage: async (stage) => clone(matches.filter((match) => match.stage === stage)),
  getMatchesByDate: async (date) => clone(matches.filter((match) => match.kickoffUTC.slice(0, 10) === date)),
  getGroups: async () => clone(groups),
  getGroupStandings: async (group) => clone(groups.find((item) => item.group === group)),
  getTeams: async () => clone(groups.flatMap((group) => group.teams)),
  getStadiums: async () => clone(stadiums),
};
