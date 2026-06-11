import { createContext, useEffect, useMemo, useState } from 'react';
import { matchService } from '../services/matchService';
import { config } from '../config';
import { calculateGroupStandings } from '../utils/standings';

export const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [state, setState] = useState({
    matches: [],
    groups: [],
    stadiums: [],
    scheduleMetadata: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    let interval;

    const load = async (showLoading = false) => {
      if (showLoading && active) {
        setState((current) => ({ ...current, loading: true }));
      }

      try {
        const [matches, baseGroups, stadiums, scheduleMetadata] = await Promise.all([
          matchService.getAllMatches(),
          matchService.getGroups(),
          matchService.getStadiums(),
          matchService.getScheduleMetadata(),
        ]);

        if (active) setState({
          matches,
          groups: calculateGroupStandings(baseGroups, matches),
          stadiums,
          scheduleMetadata,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (active) setState((current) => ({ ...current, loading: false, error: error.message }));
      }
    };

    load(true);
    interval = window.setInterval(() => load(false), config.POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
