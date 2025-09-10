import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, IconButton, TextField, Typography, Stack, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem, Box, Paper, SelectChangeEvent, Autocomplete } from '@mui/material';
import { faEdit, faPause, faPlay, faRotateRight, faSave, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Timer } from 'easytimer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./TimerBlock.module.scss"

interface TimerBlockProps {
  isViewMode: boolean
  id: number;
  onDelete: (id: number) => void;
}

export let TimerBlock = (props: TimerBlockProps) => {
  // The easytimer object used
  const timerRef = useRef(new Timer());
  const [time, setTime] = useState('00:00');
  const [isRunning, setIsRunning] = useState(false);

  // The countdown time (fixed time)
  const [inputSeconds, setInputSeconds] = useState(60);
  // Countdown to specified time mode
  const [countdownToTime, setCountdownToTime] = useState(false);
  const [targetTime, setTargetTime] = useState("");

  // Text description with text field
  const [text, setText] = useState('Editable description here...');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);
  const [isShowNoteOnly, setShowNoteOnly] = useState(false)

  // Minutes display only mode
  const [minutesOnly, setMinutesOnly] = useState(false);
  const [secondThreshold, setSecondThreshold] = useState(60);

  // Play sound at the end of countdown
  const [playSound, setPlaySound] = useState(false);
  const [customSound, setCustomSound] = useState("");
  const [soundList, setSoundList] = useState<string[]>([""])
  const [startEndingSound, setStartEndingSound] = useState(false)

  useEffect(() => {
    const t = timerRef.current;

    t.addEventListener('targetAchieved', () => {
      setIsRunning(false);
      setStartEndingSound(true)
    });

    // Cần sửa lại vì khi các yếu tố ở dưới thay đổi, đồng hồ bị dừng lại => Không đúng.
    return () => {
      t.stop();
    };
  }, []);

  useEffect(() => {
    const t = timerRef.current;

    t.addEventListener('secondsUpdated', () => {
      const totalSeconds = t.getTotalTimeValues().seconds
      const totalMins = t.getTotalTimeValues().minutes

      if (minutesOnly && (totalSeconds >= secondThreshold)) {
        // Show only minutes
        const minStr = totalMins > 0 ? totalMins.toString() : '<1'
        setTime(`${minStr} min`);
      } else {
        // Show full mm:ss
        setTime(t.getTimeValues().toString(['minutes', 'seconds']));
      }
    });
  }, [minutesOnly, secondThreshold, timerRef])

  const startTimer = () => {
    const timer = timerRef.current
    if (countdownToTime && targetTime) {
      // Parse target HH:mm
      const [hh, mm] = targetTime.split(":").map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hh, mm, 0, 0);

      // If target already passed today, assume tomorrow
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const diffMs = target.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      timer.start({ countdown: true, startValues: { seconds: diffSeconds } });
      setIsRunning(true)
    } else {
      // Normal mode: countdown by minutes
      timer.start({ countdown: true, startValues: { seconds: inputSeconds } });
      setIsRunning(true)
    }
  };

  const pauseTimer = () => {
    timerRef.current.pause();
    setIsRunning(false);
  };

  const resetTimer = () => {
    timerRef.current.stop();
    setTime('00:00');
    setIsRunning(false);
  };

  useEffect(() => {
    if(startEndingSound && customSound !== "" && playSound) {
      const audio = new Audio(customSound);
      audio.play();
    }
    setStartEndingSound(false)
  }, [startEndingSound, playSound, customSound])

  const handleSoundSelected = (event: any, newValue: string|null) => {
    if (newValue) {
      setCustomSound(newValue);
    }
  };

  const updateSoundList = async () => {
    let soundList = await window.electronAPI.selectSoundFolder()
    setSoundList(soundList)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setText(editValue);
    }
    setIsEditing(!isEditing);
  };

  const handleSetThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10); // Base 10
    if (!isNaN(val)) {
      setSecondThreshold(val);
    }
  };

  return (
    <Paper className={styles.timerBlock}>
      {/* Timer */}
      {!isShowNoteOnly &&
        <Typography variant="h4" align="center">
          {time}
        </Typography>}

      {/* Option to countdown to specific time */}
      {!props.isViewMode &&
        <Stack direction="row" className={styles.timeSetting}>

          <FormControlLabel
            control={
              <Switch
                checked={countdownToTime}
                onChange={(e) => setCountdownToTime(e.target.checked)}
              />
            }
            label="Countdown to specific time"
          />
        </Stack>}

      {!props.isViewMode &&
        <Stack>
          {countdownToTime ? (
            <TextField
              label="Target Time"
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: 1 } }}
            />
          ) : (
            <TextField
              label="Seconds"
              type="number"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(Number(e.target.value))}
            />
          )}
        </Stack>}

      {/* Option to show minutes only */}
      {!props.isViewMode &&
        <Stack className={styles.minutesOnly}>
          <FormControlLabel
            control={
              <Switch
                checked={minutesOnly}
                onChange={(e) => setMinutesOnly(e.target.checked)}
              />
            }
            label="Show minutes only"
          />

          {minutesOnly && (
            <TextField
              type="number"
              label="Second threshold"
              size="small"
              value={secondThreshold}
              onChange={handleSetThreshold}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          )}
        </Stack>}

      {/* Option to play sound at the end */}
      {!props.isViewMode &&
        <Stack className={styles.playSound}>
          <FormControlLabel
            control={
              <Switch
                checked={playSound}
                onChange={(e) => {
                  console.log(`Set play sound to ${e.target.checked}`)
                  setPlaySound(e.target.checked)
                  console.log(`Current value: ${playSound}`)
                }}
              />
            }
            label="Play sound at end"
          />

          {playSound && (
            <Box mt={2} justifyContent="center">
              <Button variant="outlined" sx={{width: '100%'}}
               component="label" onClick={updateSoundList}>
                Select sound folder
              </Button>
              {playSound && soundList[0] !== "" && (
                <Autocomplete
                  value={customSound}
                  onChange={handleSoundSelected}
                  disablePortal
                  options={soundList}
                  getOptionLabel={(option) => option.slice('mediafile://'.length)}
                  sx={{ width: '100%', marginTop: '16px'}}
                  renderInput={(params) => <TextField {...params} label="Sound" />}
                />
              )}
            </Box>)}
        </Stack>}

      {/* Option to show note only */}
      {!props.isViewMode &&
        <Stack className={styles.showNoteOnly}>
          <FormControlLabel
            control={
              <Switch
                checked={isShowNoteOnly}
                onChange={(e) => setShowNoteOnly(e.target.checked)}
              />
            }
            label="Show note only"
          />
        </Stack>}

      {/* Textfield to edit note */}
      <Stack direction="row" justifyContent="center" spacing={1} className={styles.noteEditor}>
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
        {!props.isViewMode && <>
          <IconButton onClick={handleEditToggle}>
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
          </IconButton>
        </>}
      </Stack>

      {/* Button to control the timer */}

      {!isShowNoteOnly &&
        <Stack direction="row" spacing={2} justifyContent="center" className={styles.timerButtons}>
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
        </Stack>}

      {!props.isViewMode &&
        <Stack spacing={2} justifyContent="center" className={styles.deleteButton}>
          <Button variant="contained" startIcon={
            <FontAwesomeIcon icon={faTrash} />
          } onClick={() => props.onDelete(props.id)}>
            Delete block
          </Button>
        </Stack>}
    </Paper>
  );
}