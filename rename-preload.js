const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('renameApi', {
  submit: name => ipcRenderer.send('rename', name),
  onName: callback => ipcRenderer.on('name', (_event, name) => callback(name))
});
