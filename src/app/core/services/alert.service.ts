import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(message: string) {
    return Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745'
    });
  }

  error(message: string) {
    return Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545'
    });
  }

  warning(message: string) {
    return Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#ffc107'
    });
  }

  confirm(title: string, text: string) {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545'
    });
  }
}