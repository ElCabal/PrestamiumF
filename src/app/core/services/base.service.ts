import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/base-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected http = inject(HttpClient);
  protected apiUrl = environment.apiUrl;

  protected get<T>(url: string): Observable<BaseResponse<T>> {
    return this.http.get<BaseResponse<T>>(`${this.apiUrl}/${url}`);
  }

  protected post<T>(url: string, data: any): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${this.apiUrl}/${url}`, data);
  }
}