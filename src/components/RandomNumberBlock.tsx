import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./RandomNumberBlock.module.scss"

interface RandomNumberProps {
  id: number
  onDelete: (id: number) => void;
}

const RandomNumberBlock = (props: RandomNumberProps) => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState<number | null>(null);

  const generateRandom = () => {
    if (min > max) {
      alert("Min must be less than or equal to Max");
      return;
    }
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(randomInt);
  };

  return (
    <Box display="flex" flexDirection="column" 
    alignItems="center" gap={2} p={2}
    className={styles.randomNumberBlock}>
      <Typography variant="h5">Random Number</Typography>

      <Box display="flex" gap={2}>
        <TextField
          label="Min"
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
        />
        <TextField
          label="Max"
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
        />
      </Box>

      <Button variant="contained" onClick={generateRandom}>
        Generate
      </Button>

      {result !== null && (
        <Typography variant="h6" className={styles.result}>
          Result: {result}
        </Typography>
      )}

      <Stack spacing={2}
        justifyContent="center" className={styles.deleteButton}>
        <Button variant="contained" startIcon={
          <FontAwesomeIcon icon={faTrash} />
        } onClick={() => props.onDelete(props.id)}>
          Delete block
        </Button>
      </Stack>
    </Box>
  );
};

export default RandomNumberBlock;