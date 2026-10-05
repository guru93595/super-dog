const DEFAULT_CONFIG = Object.freeze({ name: 'Super Dog', pet: 'white' });
const VALID_PETS = new Set(['white', 'gold', 'bw']);

function normalizeConfig(value) {
  const name = typeof value?.name === 'string' ? value.name.trim().slice(0, 24) : '';
  const pet = typeof value?.pet === 'string' && VALID_PETS.has(value.pet) ? value.pet : DEFAULT_CONFIG.pet;
  return { name: name || DEFAULT_CONFIG.name, pet };
}

module.exports = { DEFAULT_CONFIG, normalizeConfig };
