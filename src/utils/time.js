export const formatLocalDate = (iso, options = {}, locale) =>
  new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(iso));

export const formatLocalTime = (iso, locale) =>
  new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));

export const isToday = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
};

export const getNextMatches = (matches) => {
  const now = Date.now();
  const candidates = [...matches]
    .filter((match) => (
      match.status === 'live'
      || (
        !['finished', 'cancelled'].includes(match.status)
        && new Date(match.kickoffUTC).getTime() > now
      )
    ))
    .sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (b.status === 'live' && a.status !== 'live') return 1;
      return new Date(a.kickoffUTC) - new Date(b.kickoffUTC);
    });

  const firstMatch = candidates[0] ?? matches.at(-1);
  if (!firstMatch) return [];

  const firstKickoff = new Date(firstMatch.kickoffUTC).getTime();
  return candidates.length
    ? candidates.filter((match) => new Date(match.kickoffUTC).getTime() === firstKickoff)
    : [firstMatch];
};

export const getNextMatch = (matches) => getNextMatches(matches)[0];

export const daysUntil = (iso) => Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 86400000));
