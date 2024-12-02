import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../core/services/alert.service';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { LoanService } from '../../../loans/services/loan.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent {
  private clientService = inject(ClientService);
  private loanService = inject(LoanService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);

  client!: Client;
  loans: any[] = [];
  loading = false;

  // Totales
  totalLoaned = 0;
  totalPending = 0;
  activeLoans = 0;

  ngOnInit() {
    if (this.client) {
      this.loadClientLoans();
    }
  }

  loadClientLoans() {
    this.loading = true;
    this.loanService.getLoansByClient(this.client.id).subscribe({
      next: response => {
        if (response.success) {
          this.loans = response.data ?? [];
          this.calculateTotals();
        } else {
          this.alertService.error(response.errorMessage || 'Error al cargar los préstamos');
        }
      },
      error: error => {
        console.error('Error:', error);
        this.alertService.error('Error al cargar los préstamos');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private calculateTotals() {
    this.totalLoaned = this.loans.reduce((sum, loan) => sum + loan.amount, 0);
    this.totalPending = this.loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
    this.activeLoans = this.loans.filter(loan => loan.remainingBalance > 0).length;
  }

  onViewLoan(loan: any) {
    // Aquí implementaremos la vista detalle del préstamo
    console.log('Ver préstamo:', loan);
  }
}
