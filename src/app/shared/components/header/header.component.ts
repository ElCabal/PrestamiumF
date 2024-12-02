import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  get userFullName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  onLogout() {
    this.alertService.confirm(
      '¿Está seguro?',
      'Esta acción cerrará su sesión'
    ).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }
}
