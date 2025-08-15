import { WindowSize } from "./main";

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      togglePin: (pin: boolean) => void;
      resizeToContent: (size: WindowSize) => void;
      moveWindow: (corner: Corner) => void;
    };
  }
}

export {} // Treat as a module - must add to work