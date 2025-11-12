import { Injectable } from '@angular/core';
import { VerificationHistoryItem } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly HISTORY_KEY = 'verification_history';
  private readonly MAX_HISTORY_ITEMS = 50;

  /**
   * Добавить запись в историю
   */
  addToHistory(item: VerificationHistoryItem): void {
    const history = this.getHistory();
    history.unshift(item);

    // Ограничиваем размер истории
    if (history.length > this.MAX_HISTORY_ITEMS) {
      history.length = this.MAX_HISTORY_ITEMS;
    }

    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
  }

  /**
   * Получить историю
   */
  getHistory(): VerificationHistoryItem[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Очистить историю
   */
  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }
}
