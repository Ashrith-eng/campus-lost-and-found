const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'items.json');

function readItems() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

module.exports = { readItems, writeItems };
