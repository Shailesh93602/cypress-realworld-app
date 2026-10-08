import React, { useCallback, useEffect, useState } from "react";
import { Paper, Typography, Divider } from "@mui/material";
import ScheduledPaymentForm from "../components/ScheduledPaymentForm";
import ScheduledPaymentList from "../components/ScheduledPaymentList";
import { ScheduledPayment, ScheduledPaymentPayload } from "../models/scheduledpayment";

const api = `${import.meta.env.VITE_BACKEND_ENDPOINT}/scheduledPayments`;
const opts = (method: string, body?: unknown): RequestInit => ({
  method,
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: body ? JSON.stringify(body) : undefined,
});

const ScheduledPaymentsContainer: React.FC = () => {
  const [payments, setPayments] = useState<ScheduledPayment[]>([]);
  const load = useCallback(async () => {
    const res = await fetch(api, opts("GET"));
    setPayments((await res.json()).results);
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <Paper style={{ padding: 16 }} data-test="scheduled-payments-page">
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Scheduled Payments
      </Typography>
      <ScheduledPaymentForm onSchedule={async (p: ScheduledPaymentPayload) => { await fetch(api, opts("POST", p)); load(); }} />
      <Divider style={{ margin: "16px 0" }} />
      <ScheduledPaymentList
        payments={payments}
        onPause={async (id) => { await fetch(`${api}/${id}/pause`, opts("PATCH")); load(); }}
        onCancel={async (id) => { await fetch(`${api}/${id}`, opts("DELETE")); load(); }}
      />
    </Paper>
  );
};

export default ScheduledPaymentsContainer;
