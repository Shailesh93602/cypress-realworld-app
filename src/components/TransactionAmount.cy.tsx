import * as React from "react";
import TransactionAmount from "./TransactionAmount";

describe("Transaction Amount", () => {
  it("shows a payment with a minus sign", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const payment = transactions.results[0];
      cy.mount(<TransactionAmount transaction={payment} />);
      cy.get(`[data-test=transaction-amount-${payment.id}]`).should("have.text", "-$86.47");
    });
  });

  it("shows a request with a plus sign", () => {
    cy.fixture("public-transactions.json").then((transactions) => {
      const request = transactions.results[1];
      cy.mount(<TransactionAmount transaction={request} />);
      cy.get(`[data-test=transaction-amount-${request.id}]`).should("have.text", "+$127.24");
    });
  });
});
