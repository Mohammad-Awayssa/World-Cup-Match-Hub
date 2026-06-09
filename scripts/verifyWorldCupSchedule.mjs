import fs from 'node:fs';

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Pass the source worldcup.json path.');

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const output = JSON.parse(fs.readFileSync('src/data/matches.json', 'utf8'));
const aliases = {
  'Czech Republic': 'Czechia',
  Turkey: 'Türkiye',
  'Ivory Coast': "Côte d'Ivoire",
};

function kickoffUTC(match) {
  const parts = match.time.match(/^(\d+):(\d+)\s+UTC([+-])(\d+)$/);
  const offset = Number(parts[4]) * (parts[3] === '-' ? -1 : 1);
  const [year, month, day] = match.date.split('-').map(Number);
  return new Date(Date.UTC(
    year,
    month - 1,
    day,
    Number(parts[1]) - offset,
    Number(parts[2]),
  )).toISOString();
}

const expected = source.matches
  .filter((match) => match.group)
  .map((match, sourceIndex) => ({ ...match, sourceIndex, kickoffUTC: kickoffUTC(match) }))
  .sort((a, b) => new Date(a.kickoffUTC) - new Date(b.kickoffUTC) || a.sourceIndex - b.sourceIndex)
  .slice(0, 10);

const checks = expected.map((match, index) => {
  const actual = output.matches[index];
  return {
    match: index + 1,
    ok: actual.homeTeam === (aliases[match.team1] ?? match.team1)
      && actual.awayTeam === (aliases[match.team2] ?? match.team2)
      && actual.kickoffUTC === match.kickoffUTC,
    fixture: `${match.team1} vs ${match.team2}`,
    sourceTime: match.time,
    kickoffUTC: match.kickoffUTC,
  };
});

console.table(checks);

if (checks.some((check) => !check.ok)) {
  throw new Error('First-ten schedule verification failed.');
}

if (output.matches.length !== 104 || new Set(output.matches.map((match) => match.id)).size !== 104) {
  throw new Error('Schedule integrity check failed.');
}

console.log(`Verified first 10 matches. Total: ${output.matches.length}. Last updated: ${output.lastUpdated}.`);
