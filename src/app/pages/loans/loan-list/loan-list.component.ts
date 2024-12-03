import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanAddComponent } from '../modals/loan-add/loan-add.component';
import { AlertService } from '../../../core/services/alert.service';
import { Loan } from '../interfaces/loan.interface';
import { LoanService } from '../services/loan.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { LoanDetailComponent } from '../modals/loan-detail/loan-detail.component';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent {
  private loanService = inject(LoanService);
  private modalService = inject(NgbModal);
  private alertService = inject(AlertService);

  loans: Loan[] = [];
  loading = false;

  ngOnInit() {
    this.loadLoans();
  }

  loadLoans() {
    this.loading = true;
    this.loanService.getAllLoans().subscribe({
      next: response => {
        if (response.success) {
          this.loans = response.data ?? [];
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

  openAddModal() {
    const modalRef = this.modalService.open(LoanAddComponent, {
      size: 'xl',
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadLoans();
          this.alertService.success('Préstamo creado exitosamente');
        }
      },
      () => {}
    );
  }

  onViewDetails(loan: Loan) {
    const modalRef = this.modalService.open(LoanDetailComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
    modalRef.componentInstance.loan = loan;  // Pasamos el préstamo al componente modal
  }
  onRegisterPayment(loan: Loan) {
    // Implementaremos esto después
    console.log('Registrar pago:', loan);
  }
}
