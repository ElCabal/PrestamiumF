// src/app/features/client/services/client.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../core/interfaces/base-response.interface';
import { BaseService } from '../../../core/services/base.service';
import { InstallmentPayment, Loan, LoanDetail, LoanRequest } from '../interfaces/loan.interface';


@Injectable({
  providedIn: 'root'
})
export class LoanService extends BaseService {

  getAllLoans(): Observable<BaseResponse<Loan[]>> {
    return this.get<Loan[]>('loans');
  }

  getLoanById(id: number): Observable<BaseResponse<Loan>> {
    return this.get<Loan>(`loans/${id}`);
  }

  getLoanDetail(id: number): Observable<BaseResponse<LoanDetail>> {
    return this.get<LoanDetail>(`loans/${id}/detail`);
  }

  getLoansByClient(clientId: number): Observable<BaseResponse<Loan[]>> {
    return this.get<Loan[]>(`loans/client/${clientId}`);
  }

  createLoan(loan: LoanRequest): Observable<BaseResponse<number>> {
    return this.post<number>('loans', loan);
  }

  calculateLateFees(installmentId: number, paymentDate: Date): Observable<BaseResponse<number>> {
    return this.get<number>(`loans/installment/${installmentId}/late-fees?paymentDate=${paymentDate.toISOString()}`);
  }

  registerInstallmentPayment(installmentId: number, payment: InstallmentPayment): Observable<BaseResponse<boolean>> {
    return this.post<boolean>(`loans/installment/${installmentId}/payment`, payment);
  }
}

