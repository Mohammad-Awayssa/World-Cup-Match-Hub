const emptyStats = (team) => ({
  ...team,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points: 0,
});

const applyResult = (team, goalsFor, goalsAgainst) => {
  team.played += 1;
  team.goalsFor += goalsFor;
  team.goalsAgainst += goalsAgainst;
  team.goalDifference = team.goalsFor - team.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    team.won += 1;
    team.points += 3;
  } else if (goalsFor === goalsAgainst) {
    team.drawn += 1;
    team.points += 1;
  } else {
    team.lost += 1;
  }
};

export const calculateGroupStandings = (groups, matches) => groups.map((group) => {
  const teams = group.teams.map(emptyStats);
  const byCode = new Map(teams.map((team) => [team.code, team]));

  matches
    .filter((match) => (
      match.stage === 'Group Stage'
      && match.group === group.group
      && match.status === 'finished'
      && Number.isFinite(match.homeScore)
      && Number.isFinite(match.awayScore)
    ))
    .forEach((match) => {
      const home = byCode.get(match.homeCode);
      const away = byCode.get(match.awayCode);
      if (!home || !away) return;

      applyResult(home, match.homeScore, match.awayScore);
      applyResult(away, match.awayScore, match.homeScore);
    });

  teams.sort((a, b) => (
    b.points - a.points
    || b.goalDifference - a.goalDifference
    || b.goalsFor - a.goalsFor
    || a.name.localeCompare(b.name)
  ));

  return { ...group, teams };
});
