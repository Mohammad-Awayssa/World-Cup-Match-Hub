import { localizeCity, localizeTeam } from '../i18n/entities.js';

export const sortByKickoff = (matches, direction = 'asc') =>
  [...matches].sort((a, b) => {
    const delta = new Date(a.kickoffUTC) - new Date(b.kickoffUTC);
    return direction === 'asc' ? delta : -delta;
  });

export const filterMatches = (matches, filter, search, favorites, onlyFavorites, language = 'en') => {
  const query = search.trim().toLowerCase();
  return matches.filter((match) => {
    const filterMatch = filter === 'all'
      || match.stage === filter
      || match.group === filter.replace('Group ', '');
    const searchableValues = [
      match.homeTeam,
      match.awayTeam,
      match.city,
      localizeTeam(match.homeTeam, match.homeCode, language),
      localizeTeam(match.awayTeam, match.awayCode, language),
      localizeCity(match.city, language),
    ].filter(Boolean).map((value) => value.toLowerCase());
    const searchMatch = !query || searchableValues.some((value) => value.includes(query));
    const favoriteMatch = !onlyFavorites
      || favorites.includes(match.homeCode)
      || favorites.includes(match.awayCode);
    return filterMatch && searchMatch && favoriteMatch;
  });
};
