export const sortByKickoff = (matches, direction = 'asc') =>
  [...matches].sort((a, b) => {
    const delta = new Date(a.kickoffUTC) - new Date(b.kickoffUTC);
    return direction === 'asc' ? delta : -delta;
  });

export const filterMatches = (matches, filter, search, favorites, onlyFavorites) => {
  const query = search.trim().toLowerCase();
  return matches.filter((match) => {
    const filterMatch = filter === 'all'
      || match.stage === filter
      || match.group === filter.replace('Group ', '');
    const searchMatch = !query
      || match.homeTeam.toLowerCase().includes(query)
      || match.awayTeam.toLowerCase().includes(query)
      || match.city.toLowerCase().includes(query);
    const favoriteMatch = !onlyFavorites
      || favorites.includes(match.homeCode)
      || favorites.includes(match.awayCode);
    return filterMatch && searchMatch && favoriteMatch;
  });
};
