import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoxService } from '../services/box.service';
import { AlertService } from '../../../core/services/alert.service';
import { BoxDetail } from '../interfaces/box.interface';

@Component({
  selector: 'app-box-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './box-detail.component.html',
  styleUrl: './box-detail.component.scss'
})
export class BoxDetailComponent {
  private boxService = inject(BoxService);
  private alertService = inject(AlertService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  box!: BoxDetail;
  loading = false;
  totalIncome = 0;
  totalExpense = 0;

  ngOnInit() {
    const boxId = this.route.snapshot.paramMap.get('id');
    if (boxId) {
      this.loadBoxDetail(boxId);
    } else {
      this.router.navigate(['/cajas']);
    }
  }

  loadBoxDetail(boxId: string) {
    this.loading = true;
    this.boxService.getBoxDetail(parseInt(boxId)).subscribe({
      next: (response) => {
        if (response.success) {
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
          this.router.navigate(['/cajas']);
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al cargar los detalles de la caja');
        this.router.navigate(['/cajas']);
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
