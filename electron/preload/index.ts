import { Corner, WindowSize } from '@/type/main'
import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  togglePin: (pin: boolean) => ipcRenderer.send("toggle-pin", pin),
  resizeToContent: (size: WindowSize) => ipcRenderer.send("resize-to-content", size),
  moveWindow: (corner: Corner) => ipcRenderer.send("move-window", corner),
})