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
  styleUrls: ['./payment-add.component.scss']
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
  remainingBalance: number = 0;
  maxPaymentAmount: number = 0;

  paymentForm: FormGroup = this.fb.group({
    boxId: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(0.01)]]
  });

  get f() { 
    return this.paymentForm.controls; 
  }

  ngOnInit() {
    this.loadBoxes();
    this.getRemainingBalance();
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

  getRemainingBalance() {
    // Obtener el saldo pendiente del préstamo
    if (this.installment && this.installment.loanId) {
      this.loanService.getLoanById(this.installment.loanId).subscribe({
        next: response => {
          if (response.success && response.data) {
            this.remainingBalance = response.data.remainingBalance;
            
            // Una vez que tenemos el saldo pendiente, calculamos la mora
            this.calculateLateFees();
            
            // Actualizar validadores del formulario con el saldo pendiente
            this.updateAmountValidators();
          }
        },
        error: error => {
          console.error('Error loading loan details:', error);
          this.alertService.error('Error al cargar los detalles del préstamo');
        }
      });
    } else {
      console.error('No se pudo obtener el ID del préstamo');
      this.alertService.error('Error: No se pudo obtener el ID del préstamo');
      this.activeModal.dismiss();
    }
  }

  calculateLateFees() {
    if (this.installment && this.installment.id && new Date() > new Date(this.installment.dueDate)) {
      this.loanService.calculateLateFees(this.installment.id, new Date()).subscribe({
        next: response => {
          if (response.success) {
            this.lateFees = response.data ?? 0;
            
            // Calcular el monto máximo que se puede pagar (cuota + mora)
            this.calculateMaxPaymentAmount();
          }
        },
        error: error => {
          console.error('Error calculating late fees:', error);
          // Si hay error al calcular la mora, continuamos con el proceso
          this.calculateMaxPaymentAmount();
        }
      });
    } else {
      // Si no hay mora, calculamos directamente el monto máximo
      this.calculateMaxPaymentAmount();
    }
  }

  calculateMaxPaymentAmount() {
    // Si el saldo pendiente es 0, no permitimos ningún pago
    if (this.remainingBalance <= 0) {
      this.maxPaymentAmount = 0;
      this.alertService.warning('Este préstamo ya está completamente pagado');
      setTimeout(() => this.activeModal.dismiss(), 2000);
      return;
    }
    
    // El monto máximo para esta cuota es el menor entre:
    // 1. El monto de la cuota + mora (si aplica)
    // 2. El saldo pendiente total del préstamo
    const installmentWithFees = this.installment.amount + this.lateFees;
    this.maxPaymentAmount = Math.min(installmentWithFees, this.remainingBalance);
    
    // Actualizar el monto del formulario con el valor calculado
    this.paymentForm.patchValue({
      amount: this.installment.amount // Establecemos por defecto el monto de la cuota sin mora
    });
    
    // Actualizar validadores del formulario
    this.updateAmountValidators();
  }

  updateAmountValidators() {
    const amountControl = this.paymentForm.get('amount');
    if (amountControl) {
      // Establecer el validador de monto máximo
      amountControl.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.maxPaymentAmount || 0.01) // Si maxPaymentAmount es 0, usamos 0.01 para evitar errores
      ]);
      amountControl.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.paymentForm.invalid) {
      return;
    }

    // Validar que el monto no exceda el saldo pendiente
    const amount = this.paymentForm.value.amount;
    if (amount > this.remainingBalance) {
      this.alertService.error(`El monto del pago (${amount.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})} ) excede el saldo pendiente (${this.remainingBalance.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})} )`);
      return;
    }

    // Validar que el monto no exceda la cuota más la mora
    if (amount > this.maxPaymentAmount) {
      this.alertService.error(`El monto del pago (${amount.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})} ) excede el monto máximo permitido (${this.maxPaymentAmount.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0})} )`);
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
