import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = process.argv[2];

if (!sourcePath) {
  throw new Error('Usage: node scripts/importWorldCupSchedule.mjs <worldcup.json>');
}

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const groups = JSON.parse(fs.readFileSync(path.join(root, 'src/data/groups.json'), 'utf8'));

const teamAliases = {
  'Czech Republic': 'Czechia',
  Turkey: 'Türkiye',
  'Ivory Coast': "Côte d'Ivoire",
};

const teams = new Map(
  groups.flatMap((group) => group.teams.map((team) => [team.name, team])),
);

const venueMap = {
  'Mexico City': ['Estadio Ciudad de Mexico', 'Mexico City', 'Mexico'],
  'Guadalajara (Zapopan)': ['Estadio Guadalajara', 'Guadalajara', 'Mexico'],
  'Monterrey (Guadalupe)': ['Estadio Monterrey', 'Monterrey', 'Mexico'],
  Toronto: ['Toronto Stadium', 'Toronto', 'Canada'],
  Vancouver: ['BC Place Vancouver', 'Vancouver', 'Canada'],
  'New York/New Jersey (East Rutherford)': ['New York New Jersey Stadium', 'New York/New Jersey', 'USA'],
  'Los Angeles (Inglewood)': ['Los Angeles Stadium', 'Los Angeles', 'USA'],
  'Dallas (Arlington)': ['Dallas Stadium', 'Dallas', 'USA'],
  'Miami (Miami Gardens)': ['Miami Stadium', 'Miami', 'USA'],
  Atlanta: ['Atlanta Stadium', 'Atlanta', 'USA'],
  Seattle: ['Seattle Stadium', 'Seattle', 'USA'],
  'San Francisco Bay Area (Santa Clara)': ['San Francisco Bay Area Stadium', 'San Francisco Bay Area', 'USA'],
  Houston: ['Houston Stadium', 'Houston', 'USA'],
  'Kansas City': ['Kansas City Stadium', 'Kansas City', 'USA'],
  'Boston (Foxborough)': ['Boston Stadium', 'Boston', 'USA'],
  Philadelphia: ['Philadelphia Stadium', 'Philadelphia', 'USA'],
};

const stageMap = {
  'Round of 32': 'Round of 32',
  'Round of 16': 'Round of 16',
  'Quarter-final': 'Quarter Finals',
  'Semi-final': 'Semi Finals',
  'Match for third place': 'Third Place',
  Final: 'Final',
};

function parseKickoffUTC(date, time) {
  const match = time.match(/^(\d{1,2}):(\d{2})\s+UTC([+-])(\d{1,2})$/);
  if (!match) throw new Error(`Unsupported timezone string: "${time}"`);

  const localHour = Number(match[1]);
  const minute = Number(match[2]);
  const offset = Number(match[4]) * (match[3] === '-' ? -1 : 1);
  const [year, month, day] = date.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day, localHour - offset, minute)).toISOString();
}

function normalizeTeam(name) {
  return teamAliases[name] ?? name;
}

function expandSlot(slot) {
  if (/^[12][A-L]$/.test(slot)) {
    return `${slot[0] === '1' ? 'Winner' : 'Runner-up'} Group ${slot[1]}`;
  }
  if (/^3[A-L/]+$/.test(slot)) return `3rd Place (${slot.slice(1)})`;
  if (/^W\d+$/.test(slot)) return `Winner Match ${slot.slice(1)}`;
  if (/^L\d+$/.test(slot)) return `Loser Match ${slot.slice(1)}`;
  return normalizeTeam(slot);
}

function venueFor(ground) {
  const venue = venueMap[ground];
  if (!venue) throw new Error(`Unknown ground: "${ground}"`);
  return venue;
}

const groupSource = source.matches.filter((match) => match.group);
const groupOccurrences = new Map();
const groupMatches = groupSource
  .map((match, sourceIndex) => {
    const group = match.group.replace('Group ', '');
    const occurrence = groupOccurrences.get(group) ?? 0;
    groupOccurrences.set(group, occurrence + 1);
    const homeTeam = normalizeTeam(match.team1);
    const awayTeam = normalizeTeam(match.team2);
    const home = teams.get(homeTeam);
    const away = teams.get(awayTeam);
    if (!home || !away) throw new Error(`Unknown team: ${homeTeam} or ${awayTeam}`);
    const [stadium, city, country] = venueFor(match.ground);

    return {
      sourceIndex,
      id: null,
      matchNumber: null,
      homeTeam,
      awayTeam,
      homeCode: home.code,
      awayCode: away.code,
      kickoffUTC: parseKickoffUTC(match.date, match.time),
      stadium,
      city,
      country,
      group,
      stage: 'Group Stage',
      round: Math.floor(occurrence / 2) + 1,
      status: 'upcoming',
      homeScore: null,
      awayScore: null,
      homePenalties: null,
      awayPenalties: null,
      winner: null,
    };
  })
  .sort((a, b) => new Date(a.kickoffUTC) - new Date(b.kickoffUTC) || a.sourceIndex - b.sourceIndex)
  .map((match, index) => {
    const { sourceIndex, ...record } = match;
    return { ...record, id: index + 1, matchNumber: index + 1 };
  });

let inferredKnockoutNumber = 103;
const knockoutMatches = source.matches
  .filter((match) => !match.group)
  .map((match) => {
    const matchNumber = match.num ?? inferredKnockoutNumber++;
    const [stadium, city, country] = venueFor(match.ground);
    return {
      id: matchNumber,
      matchNumber,
      homeTeam: expandSlot(match.team1),
      awayTeam: expandSlot(match.team2),
      homeCode: null,
      awayCode: null,
      kickoffUTC: parseKickoffUTC(match.date, match.time),
      stadium,
      city,
      country,
      group: null,
      stage: stageMap[match.round],
      round: null,
      status: 'upcoming',
      homeScore: null,
      awayScore: null,
      homePenalties: null,
      awayPenalties: null,
      winner: null,
    };
  });

const output = {
  lastUpdated: new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hebron',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fs.statSync(sourcePath).mtime),
  source: path.basename(sourcePath),
  matches: [...groupMatches, ...knockoutMatches],
};

fs.writeFileSync(
  path.join(root, 'src/data/matches.json'),
  `${JSON.stringify(output, null, 2)}\n`,
);

console.log(`Imported ${groupMatches.length} group matches and ${knockoutMatches.length} knockout matches from ${sourcePath}.`);
