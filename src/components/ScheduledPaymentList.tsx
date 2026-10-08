import React from "react";
import { List, ListItem, ListItemText, Button, Typography, Chip } from "@mui/material";
import { ScheduledPayment } from "../models/scheduledpayment";
import { formatAmount } from "../utils/transactionUtils";

const FREQUENCY_LABEL = { once: "Once", weekly: "Weekly", monthly: "Monthly" };

const ScheduledPaymentList: React.FC<{
  payments: ScheduledPayment[];
  onPause: (id: string) => void;
  onCancel: (id: string) => void;
}> = ({ payments, onPause, onCancel }) =>
  payments.length === 0 ? (
    <Typography data-test="scheduled-payments-empty" color="textSecondary">
      No scheduled payments yet
    </Typography>
  ) : (
    <List data-test="scheduled-payments-list">
      {payments.map((p) => (
        <ListItem key={p.id} data-test={`scheduled-payment-${p.id}`} divider>
          <ListItemText
            primary={`${p.payee} · ${formatAmount(p.amount * 100)}`}
            secondary={`${FREQUENCY_LABEL[p.frequency]} from ${p.startDate}${p.note ? ` · ${p.note}` : ""}`}
          />
          {p.isPaused && <Chip label="Paused" size="small" data-test="scheduled-payment-paused" />}
          <Button size="small" onClick={() => onPause(p.id)} data-test="scheduled-payment-pause">
            {p.isPaused ? "Resume" : "Pause"}
          </Button>
          <Button size="small" color="secondary" onClick={() => onCancel(p.id)} data-test="scheduled-payment-cancel">
            Cancel
          </Button>
        </ListItem>
      ))}
    </List>
  );

export default ScheduledPaymentList;
