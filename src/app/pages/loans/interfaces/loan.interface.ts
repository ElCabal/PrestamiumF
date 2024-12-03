// src/app/features/loan/interfaces/loan.interface.ts
export interface Loan {
    id: number;
    amount: number;
    interestRate: number;
    fees: number;
    frequency: string;
    totalAmountDue: number;
    totalInterestReceivable: number;
    paymentAmount: number;
    startDate: Date;
    endDate: Date;
    remainingBalance: number;
    clientId: number;
    clientName: string;
    boxId: number;
}

export interface LoanRequest {
    amount: number;
    interestRate: number;
    fees: number;
    frequency: string;
    startDate: Date;
    clientId: number;
    boxId: number;
}

export interface Installment {
    id: number;
    amount: number;
    dueDate: Date;
    isPaid: boolean;
    paymentDate?: Date;
    paidAmount: number;
}

export interface LoanDetail extends Loan {
    installments: Installment[];
}

export interface InstallmentPayment {
    amount: number;
    boxId: number;
}
export interface LoanSummary {
    id: number;
    amount: number;
    fees: number;
    startDate: Date;
    remainingBalance: number;
    status: string;
  }