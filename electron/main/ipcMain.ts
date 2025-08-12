import { BrowserWindow, ipcMain } from "electron"

let setupIpcMain = () => {
    
    // Các event cần setup
    // 'window-minimize'
    // 'window-toggle-maximize'
    // 'window-close'
    // 'window-is-maximized'
    ipcMain.on('window-minimize', () => {
        let win = BrowserWindow.getFocusedWindow()
        win?.minimize()
    })

    ipcMain.on('window-toggle-maximize', () => {
        let win = BrowserWindow.getFocusedWindow()
        if (!win) return;
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize()
        }
    });
    ipcMain.on('window-close', () => {
        let win = BrowserWindow.getFocusedWindow()
        win?.close()
    });
    ipcMain.on("toggle-pin", (event, pin: boolean) => {
        let win = BrowserWindow.getFocusedWindow()
        win?.setAlwaysOnTop(pin);
    });
    ipcMain.handle('window-is-maximized', () => {
        let win = BrowserWindow.getFocusedWindow()
        win?.isMaximized() ?? false
    });
    ipcMain.on("resize-to-content", (_, height: number) => {
        let win = BrowserWindow.getFocusedWindow()
        if (win) {
            const [width, _] = win.getSize();
            win.setSize(width, height);
        }
    })
}

export default setupIpcMain