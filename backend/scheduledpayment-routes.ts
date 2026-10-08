///<reference path="types.ts" />

import express from "express";
import shortid from "shortid";
import { ensureAuthenticated } from "./helpers";

// In-memory for now; moves to the lowdb store once the feature is out of beta.
const scheduled: any[] = [];
const router = express.Router();

//GET /scheduledPayments (scoped-user)
router.get("/", ensureAuthenticated, (req, res) => {
  res.status(200).json({ results: scheduled.filter((p) => p.userId === req.user?.id) });
});

//POST /scheduledPayments (scoped-user)
router.post("/", ensureAuthenticated, (req, res) => {
  const { payee, amount, note, startDate, frequency } = req.body;
  if (!payee || !(Number(amount) > 0) || !startDate) {
    return res.status(422).json({ error: "Payee, a positive amount and a start date are required" });
  }
  const payment = {
    id: shortid(),
    userId: req.user?.id,
    payee,
    amount: Number(amount),
    note: note || "",
    startDate,
    frequency: frequency || "once",
    isPaused: false,
    createdAt: new Date().toISOString(),
  };
  scheduled.push(payment);
  res.status(200).json({ payment });
});

//PATCH /scheduledPayments/:id/pause (scoped-user)
router.patch("/:id/pause", ensureAuthenticated, (req, res) => {
  const payment = scheduled.find((p) => p.id === req.params.id && p.userId === req.user?.id);
  if (!payment) return res.sendStatus(404);
  payment.isPaused = !payment.isPaused;
  res.status(200).json({ payment });
});

//DELETE /scheduledPayments/:id (scoped-user)
router.delete("/:id", ensureAuthenticated, (req, res) => {
  const index = scheduled.findIndex((p) => p.id === req.params.id && p.userId === req.user?.id);
  if (index < 0) return res.sendStatus(404);
  scheduled.splice(index, 1);
  res.sendStatus(200);
});

export default router;
