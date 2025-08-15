import { Corner, WindowSize } from "@/type/main"
import { BrowserWindow, ipcMain, screen } from "electron"

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
    ipcMain.on("resize-to-content", (_, size: WindowSize) => {
        let win = BrowserWindow.getFocusedWindow()
        if (win) {
            const [width, _] = win.getSize();
            win.setSize(size.width, size.height);
        }
    })
    ipcMain.on('move-window', (_, corner: Corner) => {
        let win = BrowserWindow.getFocusedWindow()
        if (win) {
            moveWindowToCorner(win, corner)
        }
    });
}

let moveWindowToCorner = (window: BrowserWindow, corner: Corner) => {
    const display = screen.getDisplayMatching(window.getBounds());
    const { workArea } = display;
    const windowBounds = window.getBounds();

    let x = workArea.x;
    let y = workArea.y;

    switch (corner) {
        case 'top-left':
        break;
        case 'top-right':
        x = workArea.x + workArea.width - windowBounds.width;
        break;
        case 'bottom-left':
        y = workArea.y + workArea.height - windowBounds.height;
        break;
        case 'bottom-right':
        x = workArea.x + workArea.width - windowBounds.width;
        y = workArea.y + workArea.height - windowBounds.height;
        break;
    }

    window.setBounds({
        x,
        y,
        width: windowBounds.width,
        height: windowBounds.height,
    });
}

export default setupIpcMain