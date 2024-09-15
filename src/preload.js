// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to the renderer process
contextBridge.exposeInMainWorld('systemAPI', {
    getSystemInfo: async () => {
        const systemInfo = await ipcRenderer.invoke('get-system-info');
        return systemInfo;
    }
});
