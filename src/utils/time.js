export const formatLocalDate = (iso, options = {}) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(new Date(iso));

export const formatLocalTime = (iso) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso));

export const isToday = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
};

export const getNextMatch = (matches) => {
  const now = Date.now();
  return [...matches]
    .filter((match) => match.status === 'live' || new Date(match.kickoffUTC).getTime() > now)
    .sort((a, b) => new Date(a.kickoffUTC) - new Date(b.kickoffUTC))[0] ?? matches.at(-1);
};

export const daysUntil = (iso) => Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 86400000));
