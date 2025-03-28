import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { Loan } from '../loans/interfaces/loan.interface';

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
  clientesRegistrados: number = 0;
  clientesConPrestamos: number = 0;
  cajasActivas: number = 0;
  saldoDisponible: number = 0;
  
  // Listas para mostrar en el dashboard
  prestamosRecientes: Loan[] = [];
  cuotasProximasVencer: any[] = [];
  cuotasVencidas: any[] = [];
  
  // Estado de carga
  loading: boolean = true;
  
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.cargarDatosDashboard();
  }
  
  cargarDatosDashboard(): void {
    this.loading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (response) => {
        console.log('Respuesta del dashboard:', response);
        if (response.success && response.data) {
          const summary = response.data;
          
          // Asignar datos del resumen
          this.totalPrestado = summary.totalPrestado;
          this.saldoPendiente = summary.saldoPendiente;
          this.saldoDisponible = summary.saldoDisponible;
          this.clientesRegistrados = summary.clientesRegistrados;
          this.clientesConPrestamos = summary.clientesConPrestamos;
          this.cajasActivas = summary.cajasActivas;
          this.prestamosRecientes = summary.prestamosRecientes;
          this.cuotasProximasVencer = summary.cuotasProximasVencer;
          this.cuotasVencidas = summary.cuotasVencidas;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos del dashboard:', err);
        this.loading = false;
      }
    });
  }
  
  verDetallePrestamo(id: number): void {
    this.router.navigate(['/prestamos/detalle', id]);
  }
  
  verDetalleCliente(id: number): void {
    this.router.navigate(['/clientes/detalle', id]);
  }
  
  verDetalleCaja(id: number): void {
    this.router.navigate(['/cajas/detalle', id]);
  }
}
