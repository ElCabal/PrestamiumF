import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../core/interfaces/base-response.interface';
import { BaseService } from '../../../core/services/base.service';
import { DashboardSummary } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  getDashboardSummary(): Observable<BaseResponse<DashboardSummary>> {
    return this.get<DashboardSummary>('dashboard/summary');
  }
}
