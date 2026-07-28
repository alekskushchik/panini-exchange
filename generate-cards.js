import fs from 'fs';
import path from 'path';

const assetsDir = './public/assets';
const cardSet = [];
let globalCardIndex = 1;

// Визначити порядок папок
const folderOrder = [
  'Golden Baller',
  // Країни будуть додані в алфавітному порядку
  'Contenders',
  'Special 2',
  'Special 1', 
  'Ultra Rare',
  'Official Mascot',
  'Eternos 22',
  'Limited Edition',
  'FIFA World Cup Master  (Dream Box Exclusive)'
];

// Get all team directories
let allTeams = fs.readdirSync(assetsDir).filter(f => {
  const fullPath = path.join(assetsDir, f);
  return fs.statSync(fullPath).isDirectory();
});

// Відділити країни від спеціальних наборів
const countries = allTeams.filter(team => !folderOrder.includes(team)).sort();
const specialTeams = folderOrder.filter(team => allTeams.includes(team));

// Об'єднати в правильному порядку
const orderedTeams = [
  ...specialTeams.filter(t => t === 'Golden Baller'),
  ...countries,
  ...specialTeams.filter(t => t !== 'Golden Baller')
];

console.log('Порядок папок:');
orderedTeams.forEach((team, idx) => {
  console.log(`  ${idx + 1}. ${team}`);
});

// Iterate through teams in correct order
orderedTeams.forEach(team => {
  const teamPath = path.join(assetsDir, team);
  if (!fs.existsSync(teamPath)) {
    console.warn(`Папка не знайдена: ${team}`);
    return;
  }
  
  const files = fs.readdirSync(teamPath)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    .sort();

  files.forEach((file) => {
    const playerName = file.replace(/\.\w+$/, '');
    const uniqueId = `card-${globalCardIndex}`;
    
    cardSet.push({
      id: uniqueId,
      number: globalCardIndex,
      playerName: playerName,
      team,
      rarity: 'base',
      image: `/assets/${team}/${file}`
    });
    
    globalCardIndex++;
  });
});

// Write to JSON file
fs.writeFileSync(
  './src/data/cardSet.json',
  JSON.stringify(cardSet, null, 2)
);

console.log(`\nВсього картки: ${cardSet.length}`);
console.log('\nПерші 15 карт:');
cardSet.slice(0, 15).forEach(card => {
  console.log(`  #${card.number}: ${card.playerName} (${card.team})`);
});
