import { createContext, useEffect, useMemo, useState } from 'react';
import { matchService } from '../services/matchService';

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
    Promise.all([
      matchService.getAllMatches(),
      matchService.getGroups(),
      matchService.getStadiums(),
      matchService.getScheduleMetadata(),
    ])
      .then(([matches, groups, stadiums, scheduleMetadata]) => {
        if (active) setState({
          matches,
          groups,
          stadiums,
          scheduleMetadata,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (active) setState((current) => ({ ...current, loading: false, error: error.message }));
      });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
