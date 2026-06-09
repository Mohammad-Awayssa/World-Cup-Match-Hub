import { useContext } from 'react';
import { DataContext } from '../context/DataProvider';

export function useMatchData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useMatchData must be used inside DataProvider');
  return context;
}
