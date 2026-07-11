export function getMatchScores(match) {
  const homeScore = match?.score?.home ?? match?.homeScore
  const awayScore = match?.score?.away ?? match?.awayScore

  return {
    homeScore,
    awayScore,
    homePenalties: match?.score?.penalties?.home ?? match?.homePenalties,
    awayPenalties: match?.score?.penalties?.away ?? match?.awayPenalties,
  }
}

export function formatDisplayScore(match, isArabic) {
  const { homeScore, awayScore } = getMatchScores(match)

  if (homeScore == null || awayScore == null) {
    return null
  }

  return isArabic
    ? `${awayScore}-${homeScore}`
    : `${homeScore}-${awayScore}`
}
