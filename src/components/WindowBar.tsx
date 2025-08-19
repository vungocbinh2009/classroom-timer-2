import React, { useState, useEffect } from 'react';
import styles from "./WindowBar.module.scss"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Popper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowsUpDownLeftRight, faCaretDown, faEye, faInfo, faLocationCrosshairs, faPencil, faThumbtack, faThumbtackSlash, faWindowClose, faWindowMaximize, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { Corner } from '@/type/main';
import { BlockType } from '@/App';

interface WindowBarProps {
  isViewMode: boolean;
  onViewModeUpdated: () => void;
  onResizeWindowHeight: () => void;
  onAddBlock: (blockType: BlockType) => void;
}

export default function WindowBar(props: WindowBarProps) {
  const [isMaximize, setIsMaximize] = useState(false);
  const [isPinned, setPinned] = useState(false)
  const [cornerMenuAnchor, setCornerMenuAnchor] = useState<null | HTMLElement>(null);
  const [addBlockMenuAnchor, setAddBlockMenuAnchor] = useState<null | HTMLElement>(null);
  const cornerMenuOpen = Boolean(cornerMenuAnchor);
  const addBlockOpen = Boolean(addBlockMenuAnchor)
  const [moreBtnOpen, setMoreBtnOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [appVersion, setAppVersion] = useState('0.0.0')

  useEffect(() => {
    // Check maximize state when mounted
    if (window.electronAPI?.isMaximized) {
      window.electronAPI.isMaximized().then(setIsMaximize);
    }
  }, []);

  useEffect(() => {
    window.electronAPI.getAppVersion().then(setAppVersion)
  }, [])

  const toggleMax = async () => {
    await window.electronAPI.toggleMaximize();
    if (window.electronAPI?.isMaximized) {
      const maximized = await window.electronAPI.isMaximized();
      setIsMaximize(maximized);
    }
  };

  const pinWindow = () => {
    setPinned(!isPinned)
    window.electronAPI.togglePin(!isPinned)
  }

  const handleCornerBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setCornerMenuAnchor(event.currentTarget);
  };

  const handleMoreBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreBtnOpen(!moreBtnOpen)
  };

  const handleAddBlockBtnClick = (event: React.MouseEvent<HTMLElement>) => {
    setAddBlockMenuAnchor(event.currentTarget)
  }

  const handleCornerMenuClose = (corner?: Corner) => {
    setCornerMenuAnchor(null)
    if (corner) {
      window.electronAPI.moveWindow(corner);
    }
  };

  const handleAddBlockClose = (blockType?: BlockType) => {
    setAddBlockMenuAnchor(null)
    if (blockType) {
      props.onAddBlock(blockType);
    }
  };

  const functionalButton = (className: string) => (
    <div className={className}>
      <IconButton onClick={handleCornerBtnClick}>
        <FontAwesomeIcon icon={faLocationCrosshairs} />
      </IconButton>
      <IconButton size="small" onClick={pinWindow}>
        <FontAwesomeIcon icon={isPinned ? faThumbtack : faThumbtackSlash} />
      </IconButton>
      <IconButton size="small" onClick={props.onViewModeUpdated}>
        <FontAwesomeIcon icon={props.isViewMode ? faEye : faPencil} />
      </IconButton>
      <IconButton size="small" onClick={handleAddBlockBtnClick}>
        <FontAwesomeIcon icon={faAdd} />
      </IconButton>
      <IconButton size="small" onClick={() => setAboutOpen(true)}>
        <FontAwesomeIcon icon={faInfo} />
      </IconButton>
    </div>
  )

  return (
    <>
      <div className={styles.windowBar}>
        <div className={styles.actions}>
          {functionalButton(styles.functionalButton)}
          <IconButton size="small" onClick={handleMoreBtnClick} className={styles.moreButton}>
            <FontAwesomeIcon icon={faCaretDown} />
          </IconButton>
          <IconButton size="small" onClick={props.onResizeWindowHeight}>
            <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
          </IconButton>
          <IconButton size="small" onClick={() => window.electronAPI.minimize()}>
            <FontAwesomeIcon icon={faWindowMinimize} />
          </IconButton>
          <IconButton size="small" onClick={toggleMax}>
            <FontAwesomeIcon icon={isMaximize ? faWindowRestore : faWindowMaximize} />
          </IconButton>
          <IconButton size="small" onClick={() => window.electronAPI.close()}>
            <FontAwesomeIcon icon={faWindowClose} />
          </IconButton>

          <Menu
            anchorEl={cornerMenuAnchor}
            open={cornerMenuOpen}
            onClose={() => handleCornerMenuClose()}
          >
            <MenuItem onClick={() => handleCornerMenuClose('top-left')}>Top Left</MenuItem>
            <MenuItem onClick={() => handleCornerMenuClose('top-right')}>Top Right</MenuItem>
            <MenuItem onClick={() => handleCornerMenuClose('bottom-left')}>Bottom Left</MenuItem>
            <MenuItem onClick={() => handleCornerMenuClose('bottom-right')}>Bottom Right</MenuItem>
          </Menu>

          <Menu
            anchorEl={addBlockMenuAnchor}
            open={addBlockOpen}
            onClose={() => handleAddBlockClose()}
          >
            <MenuItem onClick={() => handleAddBlockClose(BlockType.TIMER)}>Timer</MenuItem>
            <MenuItem onClick={() => handleAddBlockClose(BlockType.RANDOM_NUMBER)}>Random number</MenuItem>
          </Menu>
        </div>
      </div>
      {moreBtnOpen && functionalButton(styles.secondaryBar)}

      {/* About Dialog */}
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)}>
        <DialogTitle>About This App</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            App name: Classroom Timer 2 <br />
            Version: {appVersion}<br />
            Author: Vu Ngoc Binh <br />
            Description: Lightweight timer tool for teaching <br />
            App icon generated by ChatGPT
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}