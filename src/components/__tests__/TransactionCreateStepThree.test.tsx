import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { interpret } from "xstate";
import { createTransactionMachine } from "../../machines/createTransactionMachine";
import TransactionCreateStepThree from "../TransactionCreateStepThree";

describe("TransactionCreateStepThree", () => {
  it("shows the cents of the amount that was paid", () => {
    const service = interpret(
      createTransactionMachine.withContext({
        sender: { id: "sender1" } as any,
        receiver: { id: "receiver1", firstName: "Kristian", lastName: "Bradtke" } as any,
        transactionDetails: {
          transactionType: "payment",
          amount: "750.55",
          description: "Rent",
        } as any,
      })
    ).start("stepThree");

    render(
      <MemoryRouter>
        <TransactionCreateStepThree createTransactionService={service as any} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Paid/)).toHaveTextContent("Paid $750.55 for Rent");
  });
});
