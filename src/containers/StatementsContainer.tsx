import React, { useState } from "react";
import { Paper, Typography, Button, TextField, MenuItem } from "@mui/material";

const MONTHS = ["October 2026", "September 2026", "August 2026"];

const StatementsContainer: React.FC = () => {
  const [month, setMonth] = useState(MONTHS[0]);
  const [requested, setRequested] = useState(false);
  return (
    <Paper style={{ padding: 16 }} data-test="statements-page">
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Monthly Statements
      </Typography>
      <TextField
        select
        label="Statement month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        data-test="statements-month-select"
      >
        {MONTHS.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        data-test="statements-download"
        onClick={() => setRequested(true)}
      >
        Download PDF
      </Button>
      {requested && (
        <Typography data-test="statements-confirmation">
          Your {month} statement is being prepared.
        </Typography>
      )}
    </Paper>
  );
};

export default StatementsContainer;
