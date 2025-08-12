declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      togglePin: (pin: boolean) => void;
      resizeToContent: (height: number) => void;
    };
  }
}

export {} // Treat as a module - must add to work