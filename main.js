const { app, BrowserWindow, Tray, Menu, screen, ipcMain, dialog } = require('electron');
const path = require('path'), fs = require('fs');
const { DEFAULT_CONFIG, normalizeConfig } = require('./config');
let win, tray, rw, cursorTimer, cfg = { ...DEFAULT_CONFIG }, virtualBounds;
const cfgFile = () => path.join(app.getPath('userData'), 'config.json');
function save() {
  try {
    fs.mkdirSync(path.dirname(cfgFile()), { recursive: true });
    fs.writeFileSync(cfgFile(), JSON.stringify(cfg, null, 2), 'utf8');
  } catch (error) {
    console.error('Could not save configuration:', error);
    dialog.showErrorBox('Super Dog', 'Your settings could not be saved.');
  }
}
function loadConfig() {
  try { return normalizeConfig(JSON.parse(fs.readFileSync(cfgFile(), 'utf8'))); }
  catch (error) {
    if (error.code !== 'ENOENT') console.warn('Using default configuration:', error.message);
    return { ...DEFAULT_CONFIG };
  }
}
const send = (ch, d) => win && !win.isDestroyed() && win.webContents.send(ch, d);
function getVirtualBounds() {
  return screen.getAllDisplays().reduce((bounds, display) => ({
    x: Math.min(bounds.x, display.bounds.x),
    y: Math.min(bounds.y, display.bounds.y),
    right: Math.max(bounds.right, display.bounds.x + display.bounds.width),
    bottom: Math.max(bounds.bottom, display.bounds.y + display.bounds.height)
  }), { x: Infinity, y: Infinity, right: -Infinity, bottom: -Infinity });
}
function positionOverlay() {
  virtualBounds = getVirtualBounds();
  win.setBounds({
    x: virtualBounds.x, y: virtualBounds.y,
    width: virtualBounds.right - virtualBounds.x,
    height: virtualBounds.bottom - virtualBounds.y
  });
}

function buildMenu() {
  const pets = [['white', 'White Shih Tzu'], ['gold', 'Golden Shih Tzu'], ['bw', 'Black & White Shih Tzu']];
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: cfg.name, enabled: false },
    { label: 'Call puppy', click: () => send('cmd', 'call') },
    { label: 'Play with ball', click: () => send('cmd', 'ball') },
    { label: 'Tie near house', click: () => send('cmd', 'house') },
    { label: 'Send to sleep', click: () => send('cmd', 'sleep') },
    { type: 'separator' },
    { label: 'Switch pet', submenu: pets.map(([id, label]) => ({
        label, type: 'radio', checked: cfg.pet === id,
        click: () => { cfg.pet = id; save(); send('pet', id); } })) },
    { label: 'Rename…', click: openRename },
    { label: 'Quit', click: () => app.quit() }
  ]));
  tray.setToolTip(cfg.name);
}

function openRename() {
  if (rw && !rw.isDestroyed()) return rw.focus();
  rw = new BrowserWindow({ width: 340, height: 190, resizable: false, minimizable: false, alwaysOnTop: true,
    title: 'Rename', webPreferences: { preload: path.join(__dirname, 'rename-preload.js'), nodeIntegration: false, contextIsolation: true } });
  rw.setMenu(null);
  rw.loadFile('rename.html');
  rw.webContents.on('did-finish-load', () => rw.webContents.send('name', cfg.name));
  rw.webContents.on('did-fail-load', (_event, code, description) => console.error('Rename window failed to load:', code, description));
}
ipcMain.on('rename', (_event, value) => {
  const n = typeof value === 'string' ? value.trim().slice(0, 24) : '';
  if (n) { cfg.name = n; save(); buildMenu(); }
  if (rw && !rw.isDestroyed()) rw.close();
});

app.on('uncaughtException', error => console.error('Uncaught exception:', error));
app.on('unhandledRejection', error => console.error('Unhandled rejection:', error));

app.whenReady().then(() => {
  if (!app.requestSingleInstanceLock()) return app.quit();
  cfg = loadConfig();
  win = new BrowserWindow({
    show: false,
    transparent: true, frame: false, hasShadow: false, resizable: false,
    focusable: false, skipTaskbar: true, alwaysOnTop: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  positionOverlay();
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setIgnoreMouseEvents(true);   // clicks pass through to the apps below
  win.loadFile('index.html');
  win.webContents.on('did-fail-load', (_event, code, description) => console.error('Overlay failed to load:', code, description));
  win.webContents.on('did-finish-load', () => {
    win.showInactive();
    send('pet', cfg.pet);
  });
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  buildMenu();
  let lx = -1, ly = -1;
  cursorTimer = setInterval(() => {
    const p = screen.getCursorScreenPoint();
    if (p.x !== lx || p.y !== ly) { lx = p.x; ly = p.y; send('cursor', { x: p.x - virtualBounds.x, y: p.y - virtualBounds.y }); }
  }, 16);
  screen.on('display-added', positionOverlay);
  screen.on('display-removed', positionOverlay);
  screen.on('display-metrics-changed', positionOverlay);
}).catch(error => {
  console.error('Could not start Super Dog:', error);
  app.quit();
});
app.on('second-instance', () => { if (rw && !rw.isDestroyed()) rw.focus(); });
app.on('before-quit', () => {
  if (cursorTimer) clearInterval(cursorTimer);
  screen.removeAllListeners('display-added');
  screen.removeAllListeners('display-removed');
  screen.removeAllListeners('display-metrics-changed');
});
app.on('window-all-closed', () => {});
