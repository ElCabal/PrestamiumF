import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../loans/services/loan.service';
import { BoxService } from '../boxes/services/box.service';
import { ClientService } from '../clients/services/client.service';
import { Loan } from '../loans/interfaces/loan.interface';
import { Box } from '../boxes/interfaces/box.interface';
import { Client } from '../clients/interfaces/client.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Datos para el dashboard
  totalPrestado: number = 0;
  saldoPendiente: number = 0;
  clientesActivos: number = 0;
  cajasActivas: number = 0;
  saldoDisponible: number = 0;
  
  // Listas para mostrar en el dashboard
  prestamosRecientes: Loan[] = [];
  cuotasProximasVencer: any[] = [];
  cuotasVencidas: any[] = [];
  
  // Estado de carga
  loading: boolean = true;
  
  constructor(
    private loanService: LoanService,
    private boxService: BoxService,
    private clientService: ClientService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.cargarDatosDashboard();
  }
  
  cargarDatosDashboard(): void {
    // Obtener préstamos
    this.loanService.getAllLoans().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const prestamos = response.data;
          
          // Calcular totales
          this.totalPrestado = prestamos.reduce((total, prestamo) => total + prestamo.amount, 0);
          this.saldoPendiente = prestamos.reduce((total, prestamo) => total + prestamo.remainingBalance, 0);
          
          // Obtener préstamos recientes (últimos 5)
          this.prestamosRecientes = prestamos
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 5);
          
          // Procesar cuotas próximas a vencer y vencidas
          this.procesarCuotas(prestamos);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
    
    // Obtener cajas
    this.boxService.getBoxes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const cajas = response.data;
          this.cajasActivas = cajas.length;
          this.saldoDisponible = cajas.reduce((total, caja) => total + caja.currentBalance, 0);
        }
      }
    });
    
    // Obtener clientes
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clientesActivos = response.data.length;
        }
      }
    });
  }
  
  procesarCuotas(prestamos: Loan[]): void {
    const hoy = new Date();
    const proximosSieteDias = new Date();
    proximosSieteDias.setDate(hoy.getDate() + 7);
    
    const cuotasProximas: any[] = [];
    const cuotasVencidas: any[] = [];
    
    // Para cada préstamo, necesitamos obtener sus cuotas
    prestamos.forEach(prestamo => {
      this.loanService.getLoanDetail(prestamo.id).subscribe({
        next: (response) => {
          if (response.success && response.data && response.data.installments) {
            const cuotas = response.data.installments;
            
            // Filtrar cuotas próximas a vencer (en los próximos 7 días)
            const proximas = cuotas.filter(cuota => {
              const fechaVencimiento = new Date(cuota.dueDate);
              return !cuota.isPaid && 
                     fechaVencimiento >= hoy && 
                     fechaVencimiento <= proximosSieteDias;
            }).map(cuota => ({
              ...cuota,
              clientName: prestamo.clientName,
              loanId: prestamo.id
            }));
            
            // Filtrar cuotas vencidas
            const vencidas = cuotas.filter(cuota => {
              const fechaVencimiento = new Date(cuota.dueDate);
              return !cuota.isPaid && fechaVencimiento < hoy;
            }).map(cuota => ({
              ...cuota,
              clientName: prestamo.clientName,
              loanId: prestamo.id,
              diasVencidos: Math.floor((hoy.getTime() - new Date(cuota.dueDate).getTime()) / (1000 * 60 * 60 * 24))
            }));
            
            cuotasProximas.push(...proximas);
            cuotasVencidas.push(...vencidas);
            
            // Ordenar por fecha de vencimiento
            this.cuotasProximasVencer = cuotasProximas
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5);
              
            this.cuotasVencidas = cuotasVencidas
              .sort((a, b) => b.diasVencidos - a.diasVencidos)
              .slice(0, 5);
          }
        }
      });
    });
  }
  
  verDetallePrestamo(id: number): void {
    this.router.navigate(['/loans', id]);
  }
  
  verDetalleCliente(id: number): void {
    this.router.navigate(['/clients', id]);
  }
  
  verDetalleCaja(id: number): void {
    this.router.navigate(['/boxes', id]);
  }
}
