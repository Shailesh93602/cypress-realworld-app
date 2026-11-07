import * as React from "react";
import TransactionCreateStepTwo from "./TransactionCreateStepTwo";
import { User } from "../models";

const sender = { id: "sender-1", firstName: "Edgar", lastName: "Johns" } as User;
const receiver = { id: "receiver-1", firstName: "Arely", lastName: "Kertzmann" } as User;

describe("Transaction Create Step Two", () => {
  it("fills Amount from a quick amount button and pays that amount", () => {
    const createTransaction = cy.stub().as("createTransaction");
    cy.mount(
      <TransactionCreateStepTwo
        sender={sender}
        receiver={receiver}
        createTransaction={createTransaction}
        showSnackbar={cy.stub()}
      />
    );

    cy.get("[data-test=transaction-create-quick-amount-10]").should("have.text", "$10");
    cy.get("[data-test=transaction-create-quick-amount-50]").should("have.text", "$50");
    cy.get("[data-test=transaction-create-quick-amount-25]").should("have.text", "$25").click();
    cy.get("#amount").should("have.value", "$25");

    cy.get("[data-test=transaction-create-description-input] input").type("Lunch");
    cy.get("[data-test=transaction-create-submit-payment]").click();

    cy.get("@createTransaction").should("have.been.calledOnceWith", {
      transactionType: "payment",
      amount: "25",
      description: "Lunch",
      senderId: sender.id,
      receiverId: receiver.id,
    });
  });
});
