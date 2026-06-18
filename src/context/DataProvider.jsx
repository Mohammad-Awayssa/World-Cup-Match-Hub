import { createContext, useEffect, useMemo, useState } from 'react';
import { matchService } from '../services/matchService';
import { config } from '../config';
import { calculateGroupStandings } from '../utils/standings';
import matchesDocument from '../data/matches.json';
import baseGroups from '../data/groups.json';
import stadiums from '../data/stadiums.json';
import { mergeLiveMatches } from '../utils/liveMatches';

export const DataContext = createContext(null);

const LIVE_CACHE_KEY = 'wc2026-live-matches-cache-v2';
const LIVE_CACHE_TTL_MS = 2 * 60 * 1000;

const scheduleMetadata = {
  lastUpdated: matchesDocument.lastUpdated,
  source: matchesDocument.source,
};

const buildState = (matches, loading = false) => ({
  matches,
  groups: calculateGroupStandings(baseGroups, matches),
  stadiums,
  scheduleMetadata,
  loading,
  error: null,
});

const getBaseMatches = () => mergeLiveMatches(matchesDocument.matches, [], Date.now(), {
  inferScheduledStatus: false,
});

const readCachedMatches = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(LIVE_CACHE_KEY));
    if (!cached?.matches || Date.now() - cached.savedAt > LIVE_CACHE_TTL_MS) {
      return null;
    }
    return cached.matches;
  } catch {
    return null;
  }
};

const writeCachedMatches = (matches) => {
  try {
    localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      matches,
    }));
  } catch {
    // Live updates still work when browser storage is unavailable.
  }
};

export function DataProvider({ children }) {
  const [state, setState] = useState(() => {
    const cachedMatches = readCachedMatches();
    return buildState(cachedMatches ?? getBaseMatches(), !cachedMatches);
  });

  useEffect(() => {
    let active = true;
    let interval;

    const refreshLiveScores = async () => {
      try {
        const matches = await matchService.getLiveMatches();
        writeCachedMatches(matches);
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
