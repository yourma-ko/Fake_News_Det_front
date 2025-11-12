import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Регистрация</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email обязателен
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Неверный формат email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Имя</mat-label>
              <input matInput type="text" formControlName="name" autocomplete="name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Телефон (опционально)</mat-label>
              <input matInput type="tel" formControlName="phone" autocomplete="tel">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Пароль</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Пароль обязателен
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Минимум 6 символов
              </mat-error>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="loading || registerForm.invalid">
              <span *ngIf="!loading">Зарегистрироваться</span>
              <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Уже есть аккаунт? <a routerLink="/login">Войти</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      max-width: 400px;
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  loading = false;

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: [''],
    phone: ['']
  });

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) {
      return;
    }

    this.loading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/app']);
        this.snackBar.open('Регистрация успешна!', 'OK', { duration: 3000 });
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.detail || 'Ошибка регистрации. Попробуйте снова.';
        this.snackBar.open(message, 'Закрыть', { duration: 5000 });
      }
    });
  }
}
