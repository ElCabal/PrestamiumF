import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private themeService = inject(ThemeService);
  
  isDarkMode: boolean = false;

  ngOnInit(): void {
    // Suscribirse al estado del tema
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
      this.updateNavbarClasses();
    });
  }

  get userFullName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
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

  private updateNavbarClasses(): void {
    const navbar = document.querySelector('.main-header');
    if (navbar) {
      if (this.isDarkMode) {
        navbar.classList.remove('navbar-white', 'navbar-light');
        navbar.classList.add('navbar-dark');
      } else {
        navbar.classList.remove('navbar-dark');
        navbar.classList.add('navbar-white', 'navbar-light');
      }
    }
  }
}
