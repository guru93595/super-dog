const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('pet', {
  on: (ch, fn) => ipcRenderer.on(ch, (e, d) => fn(d))
});
