import React from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import { object, string, number } from "yup";
import { TextField, Button, MenuItem, Grid } from "@mui/material";
import { ScheduledPaymentPayload } from "../models/scheduledpayment";

const validationSchema = object({
  payee: string().required("Enter a payee"),
  amount: number().typeError("Enter a valid amount").positive("Amount must be more than $0").required("Enter an amount"),
  note: string().max(60, "Must contain no more than 60 characters"),
  startDate: string().required("Pick a start date"),
  frequency: string().oneOf(["once", "weekly", "monthly"]).required(),
});

const initialValues: ScheduledPaymentPayload = { payee: "", amount: 0, note: "", startDate: "", frequency: "monthly" };

const ScheduledPaymentForm: React.FC<{ onSchedule: (payment: ScheduledPaymentPayload) => void }> = ({ onSchedule }) => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={(values, { resetForm }) => { onSchedule(values); resetForm(); }}>
    {({ isValid, dirty }) => (
      <Form data-test="scheduled-payment-form">
        <Grid container spacing={2}>
          {(["payee", "amount", "note", "startDate"] as const).map((name) => (
            <Grid item xs={12} sm={6} key={name}>
              <Field name={name}>
                {({ field, meta }: FieldProps) => (
                  <TextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type={name === "amount" ? "number" : name === "startDate" ? "date" : "text"}
                    label={{ payee: "Payee", amount: "Amount", note: "Note (optional)", startDate: "Start date" }[name]}
                    InputLabelProps={name === "startDate" ? { shrink: true } : undefined}
                    data-test={`scheduled-payment-${name}-input`}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched ? meta.error : ""}
                  />
                )}
              </Field>
            </Grid>
          ))}
          <Grid item xs={12} sm={6}>
            <Field name="frequency">
              {({ field }: FieldProps) => (
                <TextField {...field} select fullWidth variant="outlined" margin="dense" label="Repeats" data-test="scheduled-payment-frequency-select">
                  <MenuItem value="once">Once</MenuItem>
                  <MenuItem value="weekly">Every week</MenuItem>
                  <MenuItem value="monthly">Every month</MenuItem>
                </TextField>
              )}
            </Field>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={!isValid || !dirty} data-test="scheduled-payment-submit">
              Schedule Payment
            </Button>
          </Grid>
        </Grid>
      </Form>
    )}
  </Formik>
);

export default ScheduledPaymentForm;
