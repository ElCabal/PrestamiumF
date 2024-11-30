import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLoanComponent } from '../modals/loan-add/loan-add.component';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent {
  constructor(private modalService: NgbModal) {}

  openLoanModal() {
    const modalRef = this.modalService.open(AddLoanComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      // Importante: estas clases ayudan a que el modal se muestre correctamente
      modalDialogClass: 'modal-dialog-centered',
      windowClass: 'modal-custom'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Modal cerrado con:', result);
          // Aquí manejas los datos del préstamo
        }
      },
      (reason) => {
        console.log('Modal descartado');
      }
    );
  }
}
