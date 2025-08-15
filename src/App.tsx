import { useRef, useState } from 'react';
import './App.css'
import { TimerBlock } from './components/TimerBlock'
import WindowBar from './components/WindowBar'
import { Stack } from '@mui/material';


function App() {
  const [timers, setTimers] = useState<number[]>([]);
  const [isViewMode, setViewMode] = useState(false)
  const appContainer = useRef<HTMLDivElement>(null)

  const handleViewMode = () => {
    setViewMode(!isViewMode)
  }
  
  const handleAddTimer = () => {
    setTimers((prev) => [...prev, Date.now()]); // use timestamp as unique key
  };

  const handleDeleteTimer = (id: number) => {
    setTimers((prev) => prev.filter((timerId) => timerId !== id));
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
      <WindowBar 
        onAddTimer={handleAddTimer} 
        isViewMode={isViewMode}
        onViewModeUpdated={handleViewMode} 
        onResizeWindowHeight={handleResizeWindowHeight}/>
      <Stack spacing={0} sx={{ padding: 0, alignItems: 'center'}}>
        {timers.map((id) => (
          <TimerBlock key={id} id={id} onDelete={handleDeleteTimer} isViewMode={isViewMode}/>
        ))}
      </Stack>
    </div>
  )
}

export default App