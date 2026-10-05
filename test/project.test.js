const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('renderer windows do not enable Node integration', () => {
  const main = read('main.js');
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /contextIsolation:\s*true/);
});

test('overlay is shown after its page loads', () => {
  assert.match(read('main.js'), /did-finish-load[\s\S]*showInactive\(\)/);
});

test('release packaging includes application source', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.build.appId, 'com.superdog.desktop');
  assert.ok(packageJson.build.files.includes('renderer.js'));
});
