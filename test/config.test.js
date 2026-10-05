const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_CONFIG, normalizeConfig } = require('../config');

test('normalizes valid configuration', () => {
  assert.deepEqual(normalizeConfig({ name: '  Buddy  ', pet: 'gold' }), { name: 'Buddy', pet: 'gold' });
});

test('uses safe defaults for invalid configuration', () => {
  assert.deepEqual(normalizeConfig({ name: '', pet: 'unknown' }), DEFAULT_CONFIG);
  assert.deepEqual(normalizeConfig(null), DEFAULT_CONFIG);
});

test('limits pet names to 24 characters', () => {
  assert.equal(normalizeConfig({ name: '123456789012345678901234567890', pet: 'bw' }).name.length, 24);
});
