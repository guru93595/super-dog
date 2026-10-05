const input = document.getElementById('n');
renameApi.onName(value => { input.value = value; input.select(); });
function submit() {
  const value = input.value.trim();
  if (value) renameApi.submit(value);
}
document.getElementById('ok').addEventListener('click', submit);
document.getElementById('cancel').addEventListener('click', () => window.close());
input.addEventListener('keydown', event => { if (event.key === 'Enter') submit(); });
