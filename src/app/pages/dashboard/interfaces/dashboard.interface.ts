import { Loan } from '../../loans/interfaces/loan.interface';

export interface DashboardSummary {
  totalPrestado: number;
  saldoPendiente: number;
  saldoDisponible: number;
  clientesRegistrados: number;
  clientesConPrestamos: number;
  cajasActivas: number;
  prestamosRecientes: Loan[];
  cuotasProximasVencer: Installment[];
  cuotasVencidas: Installment[];
}

export interface Installment {
  id: number;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  loanId: number;
  clientName: string;
}
