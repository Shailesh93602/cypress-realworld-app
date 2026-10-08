export interface BankAccount {
  id: string;
  uuid: string;
  userId: string;
  bankName: string;
  /** Optional label the user gives the account, e.g. "Payroll" or "Joint savings". */
  nickname?: string;
  accountNumber: string;
  routingNumber: string;
  isDeleted: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export type BankAccountPayload = Pick<
  BankAccount,
  "userId" | "bankName" | "accountNumber" | "routingNumber" | "nickname"
>;
