import { Injectable } from '@angular/core';
import { Box } from '../interfaces/box.interface';
import { BaseService } from '../../../core/services/base.service';

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
}