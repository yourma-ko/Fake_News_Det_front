import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule],
  template: `
    <div class="landing-container">
      <mat-card class="hero-card">
        <mat-card-header>
          <mat-card-title>FakeCheck</mat-card-title>
          <mat-card-subtitle>Проверка достоверности новостей с помощью AI</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p class="hero-text">
            Защитите себя от фейковых новостей. FakeCheck использует искусственный интеллект
            для анализа достоверности информации в реальном времени.
          </p>
          <div class="features">
            <div class="feature">
              <h3>🔍 Анализ по URL</h3>
              <p>Вставьте ссылку на новость для проверки</p>
            </div>
            <div class="feature">
              <h3>📝 Анализ текста</h3>
              <p>Проверьте любой текст на достоверность</p>
            </div>
            <div class="feature">
              <h3>⚡ Быстрый результат</h3>
              <p>Получите оценку за считанные секунды</p>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/register">
            Начать бесплатно
          </button>
          <button mat-button routerLink="/login">
            Войти
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .hero-card {
      max-width: 800px;
      width: 100%;
    }

    mat-card-title {
      font-size: 3rem;
      font-weight: bold;
    }

    .hero-text {
      font-size: 1.2rem;
      margin: 20px 0;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .feature {
      text-align: center;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .feature h3 {
      margin: 0 0 10px 0;
      font-size: 1.5rem;
    }

    mat-card-actions {
      display: flex;
      gap: 10px;
      padding: 20px;
    }
  `]
})
export class LandingComponent {}
