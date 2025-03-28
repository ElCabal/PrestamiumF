import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../core/services/alert.service';
import { LoanDetail } from '../../interfaces/loan.interface';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';
import { PaymentAddComponent } from '../payment-add/payment-add.component';


@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent {
  private loanService = inject(LoanService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);
  private modalService = inject(NgbModal);

  loan!: LoanDetail;
  loading = false;

  ngOnInit() {
    if (this.loan?.id) {
      this.loadLoanDetail();
    }
  }

  loadLoanDetail() {
    this.loading = true;
    this.loanService.getLoanDetail(this.loan.id).subscribe({
      next: response => {
        if (response.success) {
          this.loan = response.data!;
        } else {
          this.alertService.error(response.errorMessage || 'Error al cargar el detalle del préstamo');
        }
      },
      error: error => {
        console.error('Error:', error);
        this.alertService.error('Error al cargar el detalle del préstamo');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onRegisterPayment(installment: any) {
    const modalRef = this.modalService.open(PaymentAddComponent, {
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-second',
      modalDialogClass: 'modal-dialog-centered',
      container: '.modal-payment-container'
    });
    
    modalRef.componentInstance.installment = {
      ...installment,
      clientName: this.loan.clientName,
      installmentNumber: this.loan.installments.indexOf(installment) + 1,
      totalInstallments: this.loan.installments.length,
      loanId: this.loan.id 
    };
  
    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadLoanDetail();
          this.alertService.success('Pago registrado exitosamente');
        }
      },
      () => {}
    );
  }
}
