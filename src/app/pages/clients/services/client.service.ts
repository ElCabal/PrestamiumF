// src/app/features/client/services/client.service.ts
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BaseResponse } from '../../../core/interfaces/base-response.interface';
import { BaseService } from '../../../core/services/base.service';
import { Client, ClientRequest } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseService {

  getAllClients(): Observable<BaseResponse<Client[]>> {
    return this.get<Client[]>('clients');
  }

  getClientById(id: number): Observable<BaseResponse<Client>> {
    return this.get<Client>(`clients/${id}`);
  }

  getClientByDocument(documentNumber: string): Observable<BaseResponse<Client>> {
    return this.get<Client>(`clients/document/${documentNumber}`);
  }

  createClient(client: ClientRequest): Observable<BaseResponse<number>> {
    return this.post<number>('clients', client);
  }
}