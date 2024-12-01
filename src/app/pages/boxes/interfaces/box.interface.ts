export interface Box {
    id: number;
    name: string;
    description: string;
    initialBalance: number;
    currentBalance: number;
    status: boolean;
  }

  export interface BoxTransaction {
    id: number;
    amount: number;
    type: string;
    description: string;
    transactionDate: Date;
    previousBalance: number;
    newBalance: number;
  }

  export interface BoxDetail extends Box {
    transactions: BoxTransaction[];
    loans: LoanSimple[];
  }

  export interface LoanSimple {
    id: number;
    amount: number;
    clientName: string;
    startDate: Date;
    remainingBalance: number;
  }