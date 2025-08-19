import { Corner, WindowSize } from '@/type/main'
import { ipcRenderer, contextBridge } from 'electron'
import { IpcMainChannel } from '../shared/channel'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send(IpcMainChannel.WINDOW_MINIMIZE),
  toggleMaximize: () => ipcRenderer.send(IpcMainChannel.WINDOW_TOGGLE_MAXIMIZE),
  close: () => ipcRenderer.send(IpcMainChannel.WINDOW_CLOSE),
  isMaximized: () => ipcRenderer.invoke(IpcMainChannel.WINDOW_IS_MAXIMIZED),
  togglePin: (pin: boolean) => ipcRenderer.send(IpcMainChannel.TOGGLE_PIN, pin),
  resizeToContent: (size: WindowSize) => ipcRenderer.send(IpcMainChannel.RESIZE_TO_CONTENT, size),
  moveWindow: (corner: Corner) => ipcRenderer.send(IpcMainChannel.MOVE_WINDOW, corner),
  getAppVersion: () => ipcRenderer.invoke(IpcMainChannel.GET_APP_VERSION)
})