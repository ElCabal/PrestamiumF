import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Box, BoxDetail, BoxTransaction } from '../../interfaces/box.interface';
import { BoxService } from '../../services/box.service';
import { AlertService } from '../../../../core/services/alert.service';



@Component({
  selector: 'app-box-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-detail.component.html'
})
export class BoxDetailsComponent implements OnInit {
  private boxService = inject(BoxService);
  private alertService = inject(AlertService);
  public activeModal = inject(NgbActiveModal);

  box!: BoxDetail;
  loading = false;

  totalIncome = 0;
  totalExpense = 0;

  ngOnInit() {
    if (this.box?.id) {
      this.loadBoxDetail();
    }
  }

  loadBoxDetail() {
    this.loading = true;
    this.boxService.getBoxDetail(this.box.id).subscribe({
      next: (response) => {
        if (response.success) {
          // Ordenar transacciones por fecha (más recientes primero)
          const sortedTransactions = [...response.data!.transactions].sort((a, b) => 
            new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
          );
          
          this.box = {
            ...response.data!,
            transactions: sortedTransactions
          };
          this.calculateTotals();
        } else {
          this.alertService.error(response.errorMessage || 'Error al cargar los detalles de la caja');
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al cargar los detalles de la caja');
      },
      complete: () => {
        this.loading = false;
      }
    });
}

  private calculateTotals() {
    this.totalIncome = this.box.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpense = this.box.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }
}
