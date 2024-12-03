import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../core/services/alert.service';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-add.component.html',
  styleUrl: './client-add.component.scss'
})
export class ClientAddComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);

  clientForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    documentNumber: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],
    address: ['']
  });

  submitted = false;
  loading = false;

  get f() { 
    return this.clientForm.controls; 
  }

  onSubmit() {
    this.submitted = true;

    if (this.clientForm.invalid) {
      return;
    }

    this.loading = true;
    this.clientService.createClient(this.clientForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.activeModal.close(response.data);
        } else {
          this.alertService.error(response.errorMessage || 'Error al crear el cliente');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al crear el cliente');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onClose() {
    if (this.clientForm.dirty && !this.loading) {
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
