import matchesDocument from '../../data/matches.json';
import groups from '../../data/groups.json';
import stadiums from '../../data/stadiums.json';

const clone = (value) => structuredClone(value);
const matches = matchesDocument.matches;

export const localAdapter = {
  getAllMatches: async () => clone(matches),
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
