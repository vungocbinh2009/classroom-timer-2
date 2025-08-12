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
    if (appContainer) {
      const height = appContainer.current?.offsetHeight;
      // console.log(height)
      if (height) {
        window.electronAPI.resizeToContent(height);
      }
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