import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../core/services/alert.service';
import { BoxService } from '../../../boxes/services/box.service';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-payment-add',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './payment-add.component.html',
  styleUrl: './payment-add.component.scss'
})
export class PaymentAddComponent {
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private boxService = inject(BoxService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);

  installment: any;
  lateFees: number = 0;
  boxes: any[] = [];
  loading = false;
  submitted = false;

  paymentForm: FormGroup = this.fb.group({
    boxId: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]]
  });

  get f() { 
    return this.paymentForm.controls; 
  }

  ngOnInit() {
    this.loadBoxes();
    this.calculateLateFees();
    
    // Establecer el monto por defecto (cuota + mora)
    const totalAmount = this.installment.amount + this.lateFees;
    this.paymentForm.patchValue({
      amount: totalAmount
    });
  }

  loadBoxes() {
    this.boxService.getBoxes().subscribe({
      next: response => {
        if (response.success) {
          this.boxes = response.data ?? [];
        }
      },
      error: error => console.error('Error loading boxes:', error)
    });
  }

  calculateLateFees() {
    if (new Date() > new Date(this.installment.dueDate)) {
      this.loanService.calculateLateFees(this.installment.id, new Date()).subscribe({
        next: response => {
          if (response.success) {
            this.lateFees = response.data ?? 0;
            // Actualizar el monto del formulario
            const totalAmount = this.installment.amount + this.lateFees;
            this.paymentForm.patchValue({
              amount: totalAmount
            });
          }
        }
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.paymentForm.invalid) {
      return;
    }

    this.loading = true;
    this.loanService.registerInstallmentPayment(
      this.installment.id,
      this.paymentForm.value
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.activeModal.close(true);
        } else {
          this.alertService.error(response.errorMessage || 'Error al registrar el pago');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al registrar el pago');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
