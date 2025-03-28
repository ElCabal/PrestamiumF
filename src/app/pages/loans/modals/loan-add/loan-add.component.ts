import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../core/services/alert.service';
import { BoxService } from '../../../boxes/services/box.service';
import { ClientService } from '../../../clients/services/client.service';
import { LoanService } from '../../services/loan.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-add-loan',
  standalone: true,
  imports: [
    NgbDatepickerModule, 
    ReactiveFormsModule, 
    CommonModule,
    NgSelectModule,
    CurrencyPipe
  ],
  templateUrl: './loan-add.component.html',
  styleUrl: './loan-add.component.scss'
})
export class LoanAddComponent {
	private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private clientService = inject(ClientService);
  private boxService = inject(BoxService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);

  loanForm: FormGroup = this.fb.group({
    clientId: ['', [Validators.required]],
    boxId: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.min(1)]],
    interestRate: ['', [Validators.required, Validators.min(0.1)]],
    fees: ['', [Validators.required, Validators.min(1)]],
    frequency: ['', [Validators.required]],
    startDate: ['', [Validators.required]]
  });

  clients: any[] = [];
  boxes: any[] = [];
  submitted = false;
  loading = false;

  ngOnInit() {
    this.loadClients();
    this.loadBoxes();
  }

  get f() { 
    return this.loanForm.controls; 
  }

  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: response => {
        if (response.success) {
          // Agregar propiedad fullName a cada cliente
          this.clients = (response.data ?? []).map(client => ({
            ...client,
            fullName: `${client.firstName} ${client.lastName}`
          }));
        }
      },
      error: error => console.error('Error loading clients:', error),
      complete: () => this.loading = false
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

  onSubmit() {
    this.submitted = true;

    if (this.loanForm.invalid) {
      return;
    }

    this.loading = true;
    this.loanService.createLoan(this.loanForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.activeModal.close(response.data);
        } else {
          this.alertService.error(response.errorMessage || 'Error al crear el préstamo');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al crear el préstamo');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onClose() {
    if (this.loanForm.dirty && !this.loading) {
      this.alertService.confirm(
        '¿Está seguro?',
        'Los cambios no guardados se perderán'
      ).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.dismiss();
        }
      });
    } else {
      this.activeModal.dismiss();
    }
  }
}
