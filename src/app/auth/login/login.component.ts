import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  loading = false;
  submitted = false;
  showPassword = false;

  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        if (response.success) {
          // Guardar email si remember está marcado
          if (this.loginForm.get('remember')?.value) {
            localStorage.setItem('remembered-email', email);
          } else {
            localStorage.removeItem('remembered-email');
          }
          
          this.router.navigateByUrl('/dashboard');
        } else {
          this.alertService.error(response.errorMessage || 'Error al iniciar sesión');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.alertService.error('Error al iniciar sesión');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    // Recuperar email recordado si existe
    const rememberedEmail = localStorage.getItem('remembered-email');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        remember: true
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}