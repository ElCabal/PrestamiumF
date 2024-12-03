import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { NgxCurrencyDirective } from "ngx-currency";
import { NgxCurrencyConfig } from 'ngx-currency';

@Component({
  selector: 'app-box-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxCurrencyDirective],
  templateUrl: './box-add.component.html',
  styleUrl: './box-add.component.scss'
})
export class BoxAddComponent {
  private fb = inject(FormBuilder);
  private boxService = inject(BoxService);
  private alertService = inject(AlertService)
  public activeModal = inject(NgbActiveModal);

  currencyConfig: NgxCurrencyConfig = {
    align: "left",
    allowNegative: false, // Como requieres valores >= 0
    allowZero: true,
    decimal: ".",
    precision: 0,
    prefix: "$ ",
    suffix: "",
    thousands: ",",
    nullable: true
  };

  boxForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    initialBalance: [0, [Validators.required, Validators.min(0)]]
  });
  
  submitted = false;
  
  get f() { 
    return this.boxForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.boxForm.invalid) {
      return;
    }
    
    this.boxService.createBox(this.boxForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.success('Caja creada exitosamente');
          this.activeModal.close(response.data);
        } else {
          // Mostrar mensaje de error
          this.alertService.error(response.errorMessage || 'Error al crear la caja');
        }
      },
      error: (error) => {
        console.error('Error creating box:', error);
        this.alertService.error('Error al crear la caja');
        // Aquí podrías mostrar un mensaje de error
      }
    });
  }
}
