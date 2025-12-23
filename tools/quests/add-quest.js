#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { game: 'demo', id: null, title: null, summary: 'Describe the hook, stakes and starting point in 2-3 sentences.', steps: [], rewards: [] };
  for (let i = 2; i < argv.length; i += 1) {
    const flag = argv[i];
    const next = argv[i + 1];
    switch (flag) {
      case '--game':
      case '-g':
        if (next) args.game = next;
        break;
      case '--id':
        if (next) args.id = next;
        break;
      case '--title':
      case '-t':
        if (next) args.title = next;
        break;
      case '--summary':
        if (next) args.summary = next;
        break;
      case '--steps':
        if (next) args.steps = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      case '--rewards':
        if (next) args.rewards = next.split('|').map((s) => s.trim()).filter(Boolean);
        break;
      default:
        break;
    }
  }
  return args;
}

function slugify(value) {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readJson(fp, fallback) {
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (e) {
    console.error(`[ERROR] Cannot parse ${fp}: ${e.message}`);
    process.exit(1);
  }
}

function writeJson(fp, data) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function updateAvailable(availablePath, questId, title) {
  const data = readJson(availablePath, []);
  let updated = data;
  if (Array.isArray(data)) {
    if (data.some((entry) => entry.quest_id === questId || entry.title === title)) {
      console.error(`[ERROR] quest_id or title already present in available.json (${questId} / ${title})`);
      process.exit(1);
    }
    updated = [...data, { quest_id: questId, title }];
  } else if (data && typeof data === 'object') {
    if (data[questId]) {
      console.error(`[ERROR] quest_id '${questId}' already present in available.json`);
      process.exit(1);
    }
    if (Object.values(data).includes(title)) {
      console.error(`[ERROR] title '${title}' already used in available.json`);
      process.exit(1);
    }
    updated = { ...data, [questId]: title };
  } else {
    updated = [{ quest_id: questId, title }];
  }
  writeJson(availablePath, updated);
}

function buildMarkdown(title, summary, steps, rewards) {
  const stepsSection = steps.length
    ? steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')
    : '1. Outline key beats or challenges.';
  const rewardsSection = rewards.length ? rewards.map((r) => `- ${r}`).join('\n') : '- XP: TBD\n- Loot: TBD';
  return `# ${title}

## Summary
${summary}

## Steps
${stepsSection}

## Rewards
${rewardsSection}
`;
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.title) {
    console.error('Usage: npm run quest:add -- --title "Quest title" [--id quest-slug] [--summary "..."] [--steps "Find clue|Defeat boss"] [--rewards "500 XP|Rare item"] [--game demo]');
    process.exit(1);
  }
  const questId = args.id || slugify(args.title);
  if (!questId) {
    console.error('Unable to derive quest_id from title; provide --id explicitly.');
    process.exit(1);
  }
  const gameBase = path.join(__dirname, '..', '..', 'games', args.game);
  if (!fs.existsSync(gameBase)) {
    console.error(`[ERROR] Game folder not found: ${gameBase}`);
    process.exit(1);
  }
  const availablePath = path.join(gameBase, 'scenario', 'quests', 'available.json');
  const questDir = path.join(gameBase, 'scenario', 'quests');
  const questFile = path.join(questDir, `${questId}.md`);
  if (fs.existsSync(questFile)) {
    console.error(`[ERROR] Quest file already exists: ${questFile}`);
    process.exit(1);
  }

  updateAvailable(availablePath, questId, args.title);
  fs.mkdirSync(questDir, { recursive: true });
  fs.writeFileSync(questFile, buildMarkdown(args.title, args.summary, args.steps, args.rewards), 'utf8');

  console.log(`[OK] Quest '${args.title}' (${questId}) created:`);
  console.log(` - updated ${path.relative(process.cwd(), availablePath)}`);
  console.log(` - created ${path.relative(process.cwd(), questFile)}`);
}

main();
