import { config } from '../config';
import { apiAdapter } from './adapters/apiAdapter';
import { localAdapter } from './adapters/localAdapter';

const adapter = config.USE_LIVE_API ? apiAdapter : localAdapter;

export const matchService = {
  getAllMatches: () => adapter.getAllMatches(),
  getScheduleMetadata: () => adapter.getScheduleMetadata(),
  getMatchById: (id) => adapter.getMatchById(id),
  getMatchesByStage: (stage) => adapter.getMatchesByStage(stage),
  getMatchesByDate: (date) => adapter.getMatchesByDate(date),
  getGroups: () => adapter.getGroups(),
  getGroupStandings: (group) => adapter.getGroupStandings(group),
  getTeams: () => adapter.getTeams(),
  getStadiums: () => adapter.getStadiums(),
};
