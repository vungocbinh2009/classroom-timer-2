import { Corner, WindowSize } from "@/type/main"
import { BrowserWindow, ipcMain, screen, app } from "electron"
import { IpcMainChannel } from "../shared/channel"

let setupIpcMain = () => {
    ipcMain.on(IpcMainChannel.WINDOW_MINIMIZE, () => {
        let win = BrowserWindow.getFocusedWindow()
        win?.minimize()
    })

    ipcMain.on(IpcMainChannel.WINDOW_TOGGLE_MAXIMIZE, () => {
        let win = BrowserWindow.getFocusedWindow()
        if (!win) return;
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize()
        }
    });

    ipcMain.on(IpcMainChannel.WINDOW_CLOSE, () => {
        let win = BrowserWindow.getFocusedWindow()
        win?.close()
    });

    ipcMain.on(IpcMainChannel.TOGGLE_PIN, (event, pin: boolean) => {
        let win = BrowserWindow.getFocusedWindow()
        win?.setAlwaysOnTop(pin);
    });

    ipcMain.handle(IpcMainChannel.WINDOW_IS_MAXIMIZED, () => {
        let win = BrowserWindow.getFocusedWindow()
        return win?.isMaximized() ?? false
    });

    ipcMain.on(IpcMainChannel.RESIZE_TO_CONTENT, (_, size: WindowSize) => {
        let win = BrowserWindow.getFocusedWindow()
        if (win) {
            win.setSize(size.width, size.height);
        }
    })

    ipcMain.on(IpcMainChannel.MOVE_WINDOW, (_, corner: Corner) => {
        let win = BrowserWindow.getFocusedWindow()
        if (win) {
            moveWindowToCorner(win, corner)
        }
    });

    ipcMain.handle(IpcMainChannel.GET_APP_VERSION, () => {
        return app.getVersion()
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