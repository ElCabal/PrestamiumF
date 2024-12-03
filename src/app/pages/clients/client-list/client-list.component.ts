import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../core/services/alert.service';
import { Client } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { ClientAddComponent } from '../modals/client-add/client-add.component';
import { ClientDetailComponent } from '../modals/client-detail/client-detail.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private modalService = inject(NgbModal);
  private alertService = inject(AlertService);

  clients: Client[] = [];
  loading = false;
  viewMode: 'grid' | 'table' = 'table';

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getAllClients().subscribe({
      next: response => {
        if (response.success) {
          this.clients = response.data ?? [];
        } else {
          this.loading = false;
          this.alertService.error(response.errorMessage || 'Error al cargar los clientes');
        }
      },
      error: error => {
        console.error('Error:', error);
        this.loading = false;
        this.alertService.error('Error al cargar los clientes');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openAddModal() {
    const modalRef = this.modalService.open(ClientAddComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.loadClients();
          this.alertService.success('Cliente creado exitosamente');
        }
      },
      () => {}
    );
  }

  onViewDetails(client: Client) {
    const modalRef = this.modalService.open(ClientDetailComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    
    modalRef.componentInstance.client = client;
  }
}
