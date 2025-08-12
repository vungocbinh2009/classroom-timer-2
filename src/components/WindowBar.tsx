import React, { useState, useEffect } from 'react';
import styles from "./WindowBar.module.scss"
import { Button, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowsUpDownLeftRight, faEye, faPencil, faThumbtack, faThumbtackSlash, faWindowClose, faWindowMaximize, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

interface WindowBarProps {
  isViewMode: boolean;
  onAddTimer: () => void;
  onViewModeUpdated: () => void;
  onResizeWindowHeight: () => void;
}

export default function WindowBar(props: WindowBarProps) {
  const [isMax, setIsMax] = useState(false);
  const [isPinned, setPinned] = useState(false)

  useEffect(() => {
    // Check maximize state when mounted
    if (window.electronAPI?.isMaximized) {
      window.electronAPI.isMaximized().then(setIsMax);
    }
  }, []);

  const toggleMax = async () => {
    await window.electronAPI.toggleMaximize();
    if (window.electronAPI?.isMaximized) {
      const maximized = await window.electronAPI.isMaximized();
      setIsMax(maximized);
    }
  };
  const pinWindow = () => {
    setPinned(!isPinned)
    window.electronAPI.togglePin(!isPinned)
  }

  return (
    <div className={styles.windowBar}>
      <div className={styles.title}>Vu Ngoc Binh</div>
      <div className={styles.actions}>
        <IconButton size="small" onClick={props.onResizeWindowHeight}>
            <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
        </IconButton>
        <IconButton size="small" onClick={pinWindow}>
            <FontAwesomeIcon icon={isPinned ? faThumbtack : faThumbtackSlash} />
        </IconButton>
        <IconButton size="small" onClick={props.onViewModeUpdated}>
            <FontAwesomeIcon icon={props.isViewMode ? faEye : faPencil} />
        </IconButton>
        <IconButton size="small" onClick={props.onAddTimer}>
            <FontAwesomeIcon icon={faAdd} />
        </IconButton>
        <IconButton size="small" onClick={() => window.electronAPI.minimize()}>
            <FontAwesomeIcon icon={faWindowMinimize} />
        </IconButton>
        <IconButton size="small" onClick={toggleMax}>
            <FontAwesomeIcon icon={isMax ? faWindowRestore : faWindowMaximize} />
        </IconButton>
        <IconButton size="small" onClick={() => window.electronAPI.close()}>
            <FontAwesomeIcon icon={faWindowClose} />
        </IconButton>
      </div>
    </div>
  );
}