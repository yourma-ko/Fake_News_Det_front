import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;

  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Проверяем токен при инициализации
    if (this.isAuthenticated()) {
      this.loadCurrentUser();
    }
  }

  /**
   * Регистрация нового пользователя
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Вход в систему
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Получить текущего пользователя
   */
  getCurrentUser(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /**
   * Выход из системы
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Проверка аутентификации
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    // Проверяем срок действия токена (JWT декодинг)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Конвертируем в миллисекунды
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  /**
   * Получить токен
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Обработка ответа аутентификации
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('user_email', response.email);
    this.loadCurrentUser();
  }

  /**
   * Загрузка данных текущего пользователя
   */
  private loadCurrentUser(): void {
    this.getCurrentUser().subscribe({
      error: () => this.logout()
    });
  }
}
