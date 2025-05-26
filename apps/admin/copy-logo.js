// Skrypt do kopiowania logo z packages/shared/assets do apps/admin/src/assets
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../../packages/shared/assets/Logo-SurvivorQuest.png');
const dest = path.resolve(__dirname, './src/assets/Logo-SurvivorQuest.png');

fs.copyFileSync(src, dest);
console.log('Logo-SurvivorQuest.png copied to admin assets.');
