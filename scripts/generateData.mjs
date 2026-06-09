import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const groupTeams = {
  A: [['Mexico','mx'],['South Africa','za'],['South Korea','kr'],['Czechia','cz']],
  B: [['Canada','ca'],['Bosnia & Herzegovina','ba'],['Qatar','qa'],['Switzerland','ch']],
  C: [['Brazil','br'],['Morocco','ma'],['Haiti','ht'],['Scotland','gb-sct']],
  D: [['USA','us'],['Paraguay','py'],['Australia','au'],['Türkiye','tr']],
  E: [['Germany','de'],['Curaçao','cw'],["Côte d'Ivoire",'ci'],['Ecuador','ec']],
  F: [['Netherlands','nl'],['Japan','jp'],['Sweden','se'],['Tunisia','tn']],
  G: [['Belgium','be'],['Egypt','eg'],['Iran','ir'],['New Zealand','nz']],
  H: [['Spain','es'],['Cape Verde','cv'],['Saudi Arabia','sa'],['Uruguay','uy']],
  I: [['France','fr'],['Senegal','sn'],['Iraq','iq'],['Norway','no']],
  J: [['Argentina','ar'],['Algeria','dz'],['Austria','at'],['Jordan','jo']],
  K: [['Portugal','pt'],['DR Congo','cd'],['Uzbekistan','uz'],['Colombia','co']],
  L: [['England','gb-eng'],['Croatia','hr'],['Ghana','gh'],['Panama','pa']],
};

const venues = [
  ['Estadio Ciudad de Mexico','Mexico City','Mexico',87523],
  ['Estadio Guadalajara','Guadalajara','Mexico',48071],
  ['Estadio Monterrey','Monterrey','Mexico',53500],
  ['Toronto Stadium','Toronto','Canada',45736],
  ['BC Place Vancouver','Vancouver','Canada',54500],
  ['New York New Jersey Stadium','New York/New Jersey','USA',82500],
  ['Los Angeles Stadium','Los Angeles','USA',70240],
  ['Dallas Stadium','Dallas','USA',80000],
  ['Miami Stadium','Miami','USA',64767],
  ['Atlanta Stadium','Atlanta','USA',71000],
  ['Seattle Stadium','Seattle','USA',68740],
  ['San Francisco Bay Area Stadium','San Francisco Bay Area','USA',68500],
  ['Houston Stadium','Houston','USA',72220],
  ['Kansas City Stadium','Kansas City','USA',76416],
  ['Boston Stadium','Boston','USA',65878],
  ['Philadelphia Stadium','Philadelphia','USA',69796],
];

const groups = Object.entries(groupTeams).map(([group, teams]) => ({
  group,
  teams: teams.map(([name,code]) => ({
    name, code, played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
  })),
}));
const stadiums = venues.map(([name,city,country,capacity]) => ({ name, city, country, capacity, image: null }));

fs.writeFileSync(path.join(dataDir,'groups.json'), JSON.stringify(groups,null,2));
fs.writeFileSync(path.join(dataDir,'stadiums.json'), JSON.stringify(stadiums,null,2));
console.log(`Generated ${groups.length} groups and ${stadiums.length} stadiums.`);
console.log('The verified match schedule in matches.json is intentionally preserved.');
