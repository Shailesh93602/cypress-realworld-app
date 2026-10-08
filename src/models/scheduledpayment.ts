export type ScheduledPaymentFrequency = "once" | "weekly" | "monthly";

export interface ScheduledPayment {
  id: string;
  userId: string;
  payee: string;
  amount: number;
  note: string;
  startDate: string;
  frequency: ScheduledPaymentFrequency;
  isPaused: boolean;
  createdAt: string;
}

export type ScheduledPaymentPayload = Pick<
  ScheduledPayment,
  "payee" | "amount" | "note" | "startDate" | "frequency"
>;
