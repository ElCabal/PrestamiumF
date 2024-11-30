import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from '../../services/box.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-box-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './box-add.component.html',
  styleUrl: './box-add.component.scss'
})
export class BoxAddComponent {
  private fb = inject(FormBuilder);
  private boxService = inject(BoxService);
  public activeModal = inject(NgbActiveModal);

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
          Swal.fire('¡Caja creada!', 'La caja se ha creado correctamente', 'success');
          this.activeModal.close(response.data);
        }
      },
      error: (error) => {
        console.error('Error creating box:', error);
        // Aquí podrías mostrar un mensaje de error
      }
    });
  }
}
