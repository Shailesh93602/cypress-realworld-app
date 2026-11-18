import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionCreateStepTwo from "../TransactionCreateStepTwo";

const sender = { id: "sender1", firstName: "Edgar", lastName: "Johns" } as any;
const receiver = { id: "receiver1", firstName: "Kristian", lastName: "Bradtke" } as any;

const transaction = (transactionType: string, amount: string) => ({
  transactionType,
  amount,
  description: "Rent",
  senderId: "sender1",
  receiverId: "receiver1",
});

describe("TransactionCreateStepTwo", () => {
  let createTransaction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createTransaction = vi.fn();
    render(
      <TransactionCreateStepTwo
        sender={sender}
        receiver={receiver}
        createTransaction={createTransaction}
        showSnackbar={vi.fn()}
      />
    );
  });

  const fillForm = async (amount: string) => {
    fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: amount } });
    fireEvent.change(screen.getByPlaceholderText("Add a note"), { target: { value: "Rent" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Pay" })).toBeEnabled());
  };

  it("pays $500.00 straight away, with no dialog", async () => {
    await fillForm("500");
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    await waitFor(() =>
      expect(createTransaction).toHaveBeenCalledWith(transaction("payment", "500"))
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("asks to confirm a payment over $500.00 and pays on Confirm", async () => {
    await fillForm("750.55");
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Send $750.55 to Kristian Bradtke?"
    );
    expect(createTransaction).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(createTransaction).toHaveBeenCalledTimes(1);
    expect(createTransaction).toHaveBeenCalledWith(transaction("payment", "750.55"));
  });

  it("sends nothing on Cancel and keeps the form filled in", async () => {
    await fillForm("750.55");
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(createTransaction).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText("Amount")).toHaveValue("$750.55");
    expect(screen.getByPlaceholderText("Add a note")).toHaveValue("Rent");

    expect(screen.getByRole("button", { name: "Pay" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("never asks to confirm a request", async () => {
    await fillForm("750.55");
    fireEvent.click(screen.getByRole("button", { name: "Request" }));
    await waitFor(() =>
      expect(createTransaction).toHaveBeenCalledWith(transaction("request", "750.55"))
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
