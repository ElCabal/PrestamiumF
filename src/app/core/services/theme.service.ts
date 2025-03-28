import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Recuperar preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode.next(savedTheme === 'true');
      this.applyTheme(savedTheme === 'true');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  toggleDarkMode() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
