import { config } from '../../config';

const unavailable = async () => {
  throw new Error(`Live API mode is not enabled. Future endpoint: ${config.API_BASE_URL}`);
};

export const apiAdapter = {
  getAllMatches: unavailable,
  getScheduleMetadata: unavailable,
  getMatchById: unavailable,
  getMatchesByStage: unavailable,
  getMatchesByDate: unavailable,
  getGroups: unavailable,
  getGroupStandings: unavailable,
  getTeams: unavailable,
  getStadiums: unavailable,
};
