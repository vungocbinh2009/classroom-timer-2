import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, IconButton, TextField, Typography, Stack } from '@mui/material';
import {faEdit, faPause, faPlay, faRotateRight, faSave, faTrash} from '@fortawesome/free-solid-svg-icons'
import Timer from 'easytimer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./TimerBlock.module.scss"

interface TimerBlockProps {
  isViewMode: boolean
  id: number;
  onDelete: (id: number) => void;
}

export let TimerBlock = (props: TimerBlockProps) => {
  const timerRef = useRef(new Timer());
  const [time, setTime] = useState('00:00:00');
  const [isRunning, setIsRunning] = useState(false);
  const [inputSeconds, setInputSeconds] = useState(60);
  const [text, setText] = useState('Editable description here...');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);


  useEffect(() => {
    const t = timerRef.current;

    t.addEventListener('secondsUpdated', () => {
      setTime(t.getTimeValues().toString());
    });

    t.addEventListener('targetAchieved', () => {
      setIsRunning(false);
    });

    return () => {
      t.stop();
    };
  }, []);

  const startTimer = () => {
    timerRef.current.start({
      countdown: true,
      startValues: { seconds: inputSeconds }
    });
    setIsRunning(true);
  };

  const pauseTimer = () => {
    timerRef.current.pause();
    setIsRunning(false);
  };

  const resetTimer = () => {
    timerRef.current.stop();
    setTime('00:00:00');
    setIsRunning(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setText(editValue);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.timerBlock}>
      <Grid container spacing={2}>
        {/* Left: Timer */}
        <div className={styles.timerLeft}>
          <Typography variant="h4" align="center" gutterBottom>
            {time}
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center" className={styles.timerButtons}>
            {!props.isViewMode && <TextField
              type="number"
              size="small"
              label="Seconds"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(Number(e.target.value))}
              slotProps={{htmlInput: {min: 1}}}
            />}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} className={styles.timerRight}>
            {isEditing ? (
              <TextField
                fullWidth
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                size="small"
              />
            ) : (
              <Typography variant="h6" className={styles.timerText}>
                {text}
              </Typography>
            )}
            {
              !props.isViewMode && <>
                <IconButton onClick={handleEditToggle}>
                  <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
                </IconButton>
                <IconButton onClick={() => props.onDelete(props.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </>
            }
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" className={styles.timerButtons}>
            <IconButton
              size='small'
              onClick={startTimer}
              disabled={isRunning}
            >
              <FontAwesomeIcon icon={faPlay} />
            </IconButton>
            <IconButton
              size='small'
              onClick={pauseTimer}
              disabled={!isRunning}
            >
              <FontAwesomeIcon icon={faPause} />
            </IconButton>
            <IconButton size='small' onClick={resetTimer}>
              <FontAwesomeIcon icon={faRotateRight} />
            </IconButton>
          </Stack>
        </div>
      </Grid>
    </div>
  );
}