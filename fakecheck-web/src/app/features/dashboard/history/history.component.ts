import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../../core/services/storage.service';
import { VerificationHistoryItem } from '../../../models/api.models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule
  ],
  template: `
    <div class="history-container">
      <div class="header">
        <h1>История проверок</h1>
        <button mat-raised-button color="warn" (click)="clearHistory()" *ngIf="history.length > 0">
          Очистить историю
        </button>
      </div>

      <mat-card *ngIf="history.length === 0">
        <mat-card-content>
          <p>История проверок пуста</p>
        </mat-card-content>
      </mat-card>

      <table mat-table [dataSource]="history" class="history-table" *ngIf="history.length > 0">
        <!-- Timestamp Column -->
        <ng-container matColumnDef="timestamp">
          <th mat-header-cell *matHeaderCellDef>Дата</th>
          <td mat-cell *matCellDef="let item">
            {{ item.timestamp | date:'short' }}
          </td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Тип</th>
          <td mat-cell *matCellDef="let item">
            <mat-chip [color]="item.requestType === 'url' ? 'primary' : 'accent'">
              {{ item.requestType === 'url' ? 'URL' : 'Текст' }}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Content Column -->
        <ng-container matColumnDef="content">
          <th mat-header-cell *matHeaderCellDef>Контент</th>
          <td mat-cell *matCellDef="let item">
            {{ item.requestContent }}
          </td>
        </ng-container>

        <!-- Verdict Column -->
        <ng-container matColumnDef="verdict">
          <th mat-header-cell *matHeaderCellDef>Вердикт</th>
          <td mat-cell *matCellDef="let item">
            <mat-chip [class]="'verdict-' + item.verdict">
              {{ getVerdictLabel(item.verdict) }}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Score Column -->
        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef>Оценка</th>
          <td mat-cell *matCellDef="let item">
            {{ (item.score * 100).toFixed(0) }}%
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .history-table {
      width: 100%;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  `]
})
export class HistoryComponent implements OnInit {
  private readonly storageService = inject(StorageService);

  history: VerificationHistoryItem[] = [];
  displayedColumns: string[] = ['timestamp', 'type', 'content', 'verdict', 'score'];

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.history = this.storageService.getHistory();
  }

  clearHistory(): void {
    if (confirm('Вы уверены, что хотите очистить историю?')) {
      this.storageService.clearHistory();
      this.loadHistory();
    }
  }

  getVerdictLabel(verdict: string): string {
    const labels: Record<string, string> = {
      credible: 'Достоверно',
      questionable: 'Сомнительно',
      fake: 'Фейк',
      insufficient: 'Недостаточно данных'
    };
    return labels[verdict] || verdict;
  }
}
