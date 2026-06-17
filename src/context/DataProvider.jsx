import { createContext, useEffect, useMemo, useState } from 'react';
import { matchService } from '../services/matchService';
import { config } from '../config';
import { calculateGroupStandings } from '../utils/standings';
import matchesDocument from '../data/matches.json';
import baseGroups from '../data/groups.json';
import stadiums from '../data/stadiums.json';
import { mergeLiveMatches } from '../utils/liveMatches';

export const DataContext = createContext(null);

const scheduleMetadata = {
  lastUpdated: matchesDocument.lastUpdated,
  source: matchesDocument.source,
};

const buildState = (matches) => ({
  matches,
  groups: calculateGroupStandings(baseGroups, matches),
  stadiums,
  scheduleMetadata,
  loading: false,
  error: null,
});

const getBaseMatches = () => mergeLiveMatches(matchesDocument.matches, []);

export function DataProvider({ children }) {
  const [state, setState] = useState(() => buildState(getBaseMatches()));

  useEffect(() => {
    let active = true;
    let interval;

    const refreshLiveScores = async () => {
      try {
        const matches = await matchService.getLiveMatches();
        if (active) setState(buildState(matches));
      } catch {
        if (active) setState((current) => ({ ...current, loading: false, error: null }));
      }
    };

    refreshLiveScores();
    interval = window.setInterval(refreshLiveScores, config.POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
