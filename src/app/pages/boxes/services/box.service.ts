import { Injectable } from '@angular/core';
import { Box, BoxDetail, BoxTransaction } from '../interfaces/box.interface';
import { BaseService } from '../../../core/services/base.service';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../../core/interfaces/base-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BoxService extends BaseService {
  getBoxes() {
    return this.get<Box[]>('boxes');
  }

  createBox(box: Partial<Box>) {
    return this.post<number>('boxes', box);
  }

  getBoxTransactions(boxId: number) {
    return this.get<BoxTransaction[]>(`boxes/${boxId}/transactions`);
  }

  getBoxDetail(id: number): Observable<BaseResponse<BoxDetail>> {
    return this.get<BoxDetail>(`boxes/${id}/detail`);
  }
}