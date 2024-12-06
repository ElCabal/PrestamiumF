import { Component, inject, OnInit } from '@angular/core';
import { Box } from '../interfaces/box.interface';
import { BoxService } from '../services/box.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxAddComponent } from '../modals/box-add/box-add.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-box-list',
  standalone: true,
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './box-list.component.html',
  styleUrl: './box-list.component.scss'
})
export class BoxListComponent implements OnInit {
  private boxService = inject(BoxService);
  private modalService = inject(NgbModal);
  private router = inject(Router);
  boxes: Box[] = [];
  viewMode: 'grid' | 'table' = 'grid';
  loading = false;

  ngOnInit() {
    this.loadBoxes();
  }

  openAddModal() {
    const modalRef = this.modalService.open(BoxAddComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      modalDialogClass: 'modal-dialog-centered',
      windowClass: 'modal-custom'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Caja creada:', result);
          this.loadBoxes(); // Recargar la lista
        }
      },
      (reason) => {
        console.log('Modal cerrado');
      }
    );
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

  onViewDetails(box: Box) {
    this.router.navigate(['/cajas', box.id]);
  }
}