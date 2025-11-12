import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VerifyService } from '../../../core/services/verify.service';
import { StorageService } from '../../../core/services/storage.service';
import { VerifyResponse, Verdict } from '../../../models/api.models';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="verify-container">
      <h1>Проверка новостей</h1>

      <mat-tab-group>
        <mat-tab label="По URL">
          <div class="tab-content">
            <form [formGroup]="urlForm" (ngSubmit)="verifyByUrl()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL новости</mat-label>
                <input matInput formControlName="url" placeholder="https://example.com/news">
                <mat-error *ngIf="urlForm.get('url')?.hasError('required')">
                  URL обязателен
                </mat-error>
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="urlLoading || urlForm.invalid">
                <span *ngIf="!urlLoading">Проверить</span>
                <mat-spinner *ngIf="urlLoading" diameter="20"></mat-spinner>
              </button>
            </form>
          </div>
        </mat-tab>

        <mat-tab label="Текст">
          <div class="tab-content">
            <form [formGroup]="textForm" (ngSubmit)="verifyByText()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Текст новости</mat-label>
                <textarea
                  matInput
                  formControlName="text"
                  rows="6"
                  placeholder="Введите текст новости для проверки..."></textarea>
                <mat-error *ngIf="textForm.get('text')?.hasError('required')">
                  Текст обязателен
                </mat-error>
                <mat-error *ngIf="textForm.get('text')?.hasError('minlength')">
                  Минимум 10 символов
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>URL источника (опционально)</mat-label>
                <input matInput formControlName="url" placeholder="https://example.com">
              </mat-form-field>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="textLoading || textForm.invalid">
                <span *ngIf="!textLoading">Проверить</span>
                <mat-spinner *ngIf="textLoading" diameter="20"></mat-spinner>
              </button>
            </form>
          </div>
        </mat-tab>
      </mat-tab-group>

      <!-- Результат проверки -->
      <mat-card *ngIf="result" class="result-card">
        <mat-card-header>
          <mat-card-title>
            Результат проверки
            <mat-chip [class]="'verdict-' + result.verdict">
              {{ getVerdictLabel(result.verdict) }}
            </mat-chip>
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div class="score-section">
            <h3>Оценка достоверности</h3>
            <mat-progress-bar
              mode="determinate"
              [value]="result.score * 100"
              [color]="getScoreColor(result.score)">
            </mat-progress-bar>
            <p class="score-value">{{ (result.score * 100).toFixed(1) }}%</p>
          </div>

          <div class="score-section" *ngIf="result.siteRepScore !== null && result.siteRepScore !== undefined">
            <h3>Репутация источника</h3>
            <mat-progress-bar
              mode="determinate"
              [value]="result.siteRepScore * 100"
              color="accent">
            </mat-progress-bar>
            <p class="score-value">{{ (result.siteRepScore * 100).toFixed(1) }}%</p>
          </div>

          <div class="evidence-section">
            <h3>Обоснование</h3>
            <ul>
              <li *ngFor="let item of result.evidence">{{ item }}</li>
            </ul>
          </div>

          <div class="metadata" *ngIf="result.reusedFrom">
            <p><strong>Переиспользован результат:</strong> {{ result.reusedFrom }}</p>
          </div>

          <div class="metadata">
            <p><small>ID проверки: {{ result.newsId }}</small></p>
            <p><small>Дата: {{ result.checkedAt | date:'medium' }}</small></p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .tab-content {
      padding: 20px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .result-card {
      margin-top: 20px;
    }

    .verdict-credible {
      background-color: #4caf50 !important;
      color: white;
    }

    .verdict-questionable {
      background-color: #ff9800 !important;
      color: white;
    }

    .verdict-fake {
      background-color: #f44336 !important;
      color: white;
    }

    .verdict-insufficient {
      background-color: #9e9e9e !important;
      color: white;
    }

    .score-section {
      margin: 20px 0;
    }

    .score-value {
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 8px;
    }

    .evidence-section ul {
      list-style-position: inside;
    }

    .metadata {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class VerifyComponent {
  private readonly fb = inject(FormBuilder);
  private readonly verifyService = inject(VerifyService);
  private readonly storageService = inject(StorageService);
  private readonly snackBar = inject(MatSnackBar);

  urlLoading = false;
  textLoading = false;
  result: VerifyResponse | null = null;

  urlForm: FormGroup = this.fb.group({
    url: ['', [Validators.required]]
  });

  textForm: FormGroup = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10)]],
    url: ['']
  });

  verifyByUrl(): void {
    if (this.urlForm.invalid || this.urlLoading) return;

    this.urlLoading = true;
    this.result = null;

    this.verifyService.verifyUrl(this.urlForm.value).subscribe({
      next: (response) => {
        this.result = response;
        this.urlLoading = false;
        this.storageService.addToHistory({
          ...response,
          requestType: 'url',
          requestContent: this.urlForm.value.url,
          timestamp: new Date().toISOString()
        });
      },
      error: (error) => {
        this.urlLoading = false;
        const message = error.error?.detail || 'Ошибка проверки';
        this.snackBar.open(message, 'Закрыть', { duration: 5000 });
      }
    });
  }

  verifyByText(): void {
    if (this.textForm.invalid || this.textLoading) return;

    this.textLoading = true;
    this.result = null;

    this.verifyService.verifyText(this.textForm.value).subscribe({
      next: (response) => {
        this.result = response;
        this.textLoading = false;
        this.storageService.addToHistory({
          ...response,
          requestType: 'text',
          requestContent: this.textForm.value.text.substring(0, 100) + '...',
          timestamp: new Date().toISOString()
        });
      },
      error: (error) => {
        this.textLoading = false;
        const message = error.error?.detail || 'Ошибка проверки';
        this.snackBar.open(message, 'Закрыть', { duration: 5000 });
      }
    });
  }

  getVerdictLabel(verdict: Verdict): string {
    const labels: Record<Verdict, string> = {
      credible: 'Достоверно',
      questionable: 'Сомнительно',
      fake: 'Фейк',
      insufficient: 'Недостаточно данных'
    };
    return labels[verdict];
  }

  getScoreColor(score: number): 'primary' | 'accent' | 'warn' {
    if (score >= 0.7) return 'primary';
    if (score >= 0.4) return 'accent';
    return 'warn';
  }
}
