import { useEffect, useRef, useState } from 'react';
import { TimerBlock } from './components/TimerBlock'
import WindowBar from './components/WindowBar'
import { Box, Stack } from '@mui/material';
import RandomNumberBlock from './components/RandomNumberBlock';
import styles from "./App.module.scss"

export enum BlockType {
  TIMER = "timer",
  RANDOM_NUMBER = "randomNumber"
}

interface BlockInfo {
  time: number
  blockType: BlockType
}

function App() {
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [isViewMode, setViewMode] = useState(false)
  const appContainer = useRef<HTMLDivElement>(null)
  const windowBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateHeight = () => {
      if (windowBar.current) {
        document.documentElement.style.setProperty(
          "--windowbar-height",
          `${windowBar.current.offsetHeight}px`
        );
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleViewMode = () => {
    setViewMode(!isViewMode)
  }
  
  const handleAddBlock = (blockType: BlockType) => {
    setBlocks((prev) => [...prev, {time: Date.now(), blockType}])
  };

  const handleDeleteBlock = (time: number) => {
    setBlocks((prev) => prev.filter((info: BlockInfo) => info.time !== time));
  };

  const handleResizeWindowHeight = () => {
    const MIN_WIDTH = 320
    if (appContainer) {
      const height = appContainer.current?.offsetHeight ?? 0;
      const width = appContainer.current?.offsetWidth ?? MIN_WIDTH;
      // console.log(height)
      window.electronAPI.resizeToContent({
        height,
        width: Math.max(width, MIN_WIDTH)
      });
    }
  };
  return (
    <div ref={appContainer}>
      <Box ref={windowBar} className={styles.windowBar}>
        <WindowBar
          onAddBlock={(blockType) => handleAddBlock(blockType)} 
          isViewMode={isViewMode}
          onViewModeUpdated={handleViewMode} 
          onResizeWindowHeight={handleResizeWindowHeight}
        />
      </Box>
      
      <Stack className={styles.blockStack} spacing={0} >
        {blocks.map((info) => {
          let element = undefined
          if(info.blockType === BlockType.TIMER) {
            element = <TimerBlock key={info.time} id={info.time} onDelete={handleDeleteBlock} isViewMode={isViewMode}/>
          } else {
            element = <RandomNumberBlock key={info.time} id={info.time} onDelete={handleDeleteBlock}/>
          }
          return element
        })}
      </Stack>
    </div>
  )
}

export default App