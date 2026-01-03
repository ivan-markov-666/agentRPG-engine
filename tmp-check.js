const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, 'samples', 'blank-game', 'player-data', 'runtime', 'exploration-log.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
const type = data?.[0]?.type;
const output = {
  raw,
  type,
  charCodes: typeof type === 'string' ? Array.from(type).map((ch) => ch.charCodeAt(0)) : null,
};
const outFile = path.resolve(__dirname, 'tmp-check-output.json');
fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log('Wrote debug info to', outFile);
