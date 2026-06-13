export function formatDisplayScore(match, isArabic) {
  const homeScore = match?.score?.home ?? match?.homeScore
  const awayScore = match?.score?.away ?? match?.awayScore

  if (homeScore == null || awayScore == null) {
    return null
  }

  return isArabic
    ? `${awayScore}-${homeScore}`
    : `${homeScore}-${awayScore}`
}
