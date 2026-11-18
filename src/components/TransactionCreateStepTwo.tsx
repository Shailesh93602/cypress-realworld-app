import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import NumberFormat from "react-number-format";
import { Formik, Form, Field, FieldProps } from "formik";
import { string, object, number } from "yup";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Container,
  Avatar,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { User } from "../models";
import { formatAmount } from "../utils/transactionUtils";

// Payments over this many dollars ask the sender to confirm first.
const CONFIRM_PAYMENT_ABOVE_DOLLARS = 500;

const PREFIX = "TransactionCreateStepTwo";

const classes = {
  paper: `${PREFIX}-paper`,
  form: `${PREFIX}-form`,
  submit: `${PREFIX}-submit`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.paper}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  [`& .${classes.form}`]: {
    width: "100%",
    marginTop: theme.spacing(1),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const validationSchema = object({
  amount: number().required("Please enter a valid amount"),
  description: string().required("Please enter a note"),
  senderId: string(),
  receiverId: string(),
});

interface NumberFormatCustomProps {
  inputRef: (el: HTMLInputElement) => void;
  onChange: (event: { target: { value: string } }) => void;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            ...other,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

export interface TransactionCreateStepTwoProps {
  receiver: User;
  sender: User;
  createTransaction: Function;
  showSnackbar: Function;
}

interface FormValues {
  amount: number | "";
  description: string;
  senderId: string;
  receiverId: string;
}

const TransactionCreateStepTwo: React.FC<TransactionCreateStepTwoProps> = ({
  receiver,
  sender,
  createTransaction,
  showSnackbar,
}) => {
  const [transactionType, setTransactionType] = useState<string>();
  const [paymentToConfirm, setPaymentToConfirm] = useState<FormValues>();
  const initialValues: FormValues = {
    amount: "",
    description: "",
    senderId: sender.id,
    receiverId: receiver.id,
  };

  const submitTransaction = (type: string | undefined, values: FormValues) => {
    // reset transactionType
    setTransactionType(undefined);

    createTransaction({ transactionType: type, ...values });
    showSnackbar({
      severity: "success",
      message: "Transaction Submitted!",
    });
  };

  const cancelPayment = () => {
    setPaymentToConfirm(undefined);
    setTransactionType(undefined);
  };

  const confirmPayment = () => {
    setPaymentToConfirm(undefined);
    submitTransaction("payment", paymentToConfirm!);
  };

  return (
    <StyledPaper className={classes.paper} elevation={0}>
      <Dialog
        open={Boolean(paymentToConfirm)}
        onClose={cancelPayment}
        data-test="transaction-confirm-dialog"
      >
        <DialogTitle>
          Send {paymentToConfirm && formatAmount(Math.round(Number(paymentToConfirm.amount) * 100))}{" "}
          to {receiver.firstName} {receiver.lastName}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={cancelPayment} data-test="transaction-confirm-cancel">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmPayment}
            data-test="transaction-confirm-submit"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Box display="flex" height={200} alignItems="center" justifyContent="center">
        <Grid container direction="column" justifyContent="flex-start" alignItems="center">
          <Grid item>
            <Avatar src={receiver.avatar} />
          </Grid>
          <Grid item>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              {receiver.firstName} {receiver.lastName}
              {transactionType}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Container maxWidth="xs">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnMount={true}
          onSubmit={(values, { setSubmitting }) => {
            if (
              transactionType === "payment" &&
              Number(values.amount) > CONFIRM_PAYMENT_ABOVE_DOLLARS
            ) {
              setSubmitting(false);
              setPaymentToConfirm(values);
              return;
            }

            setSubmitting(true);
            submitTransaction(transactionType, values);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form className={classes.form} data-test="transaction-create-form">
              <Field name="amount">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    required
                    autoFocus
                    id={"transaction-create-amount-input"}
                    type="text"
                    placeholder="Amount"
                    data-test={"transaction-create-amount-input"}
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                      inputProps: { id: "amount" },
                    }}
                    {...field}
                  />
                )}
              </Field>
              <Field name="description">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    required
                    id={"transaction-create-description-input"}
                    type="text"
                    placeholder="Add a note"
                    data-test={"transaction-create-description-input"}
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    data-test="transaction-create-submit-request"
                    disabled={!isValid || isSubmitting}
                    onClick={() => setTransactionType("request")}
                  >
                    Request
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    data-test="transaction-create-submit-payment"
                    disabled={!isValid || isSubmitting}
                    onClick={() => setTransactionType("payment")}
                  >
                    Pay
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </StyledPaper>
  );
};

export default TransactionCreateStepTwo;
