import { createContext, useEffect, useMemo, useState } from 'react';
import { matchService } from '../services/matchService';
import { config } from '../config';
import { calculateGroupStandings } from '../utils/standings';
import matchesDocument from '../data/matches.json';
import baseGroups from '../data/groups.json';
import stadiums from '../data/stadiums.json';
import { mergeLiveMatches, resolveKnockoutParticipants } from '../utils/liveMatches';

export const DataContext = createContext(null);

const LIVE_CACHE_KEY = 'wc2026-live-matches-cache-v3';
const LEGACY_LIVE_CACHE_KEYS = ['wc2026-live-matches-cache-v2'];
const LIVE_CACHE_TTL_MS = 2 * 60 * 1000;

const scheduleMetadata = {
  lastUpdated: matchesDocument.lastUpdated,
  source: matchesDocument.source,
};

const prepareMatches = (matches, now = Date.now(), inferScheduledStatus = true) => (
  resolveKnockoutParticipants(
    mergeLiveMatches(matchesDocument.matches, matches, now, { inferScheduledStatus }),
    matchesDocument.matches,
  )
);

const buildState = (matches, loading = false) => {
  const preparedMatches = prepareMatches(matches);

  return {
    matches: preparedMatches,
    groups: calculateGroupStandings(baseGroups, preparedMatches),
    stadiums,
    scheduleMetadata,
    loading,
    error: null,
  };
};

const getBaseMatches = () => prepareMatches([], Date.now(), false);

const readCachedMatches = () => {
  try {
    for (const key of [LIVE_CACHE_KEY, ...LEGACY_LIVE_CACHE_KEYS]) {
      const cached = JSON.parse(localStorage.getItem(key));
      if (cached?.matches && Date.now() - cached.savedAt <= LIVE_CACHE_TTL_MS) {
        return prepareMatches(cached.matches);
      }
    }
    return null;
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
        const preparedMatches = prepareMatches(matches);
        writeCachedMatches(preparedMatches);
        if (active) setState(buildState(preparedMatches));
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
