import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VerifyUrlRequest, VerifyTextRequest, VerifyResponse } from '../../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class VerifyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/verify`;

  /**
   * Проверка новости по URL
   */
  verifyUrl(request: VerifyUrlRequest): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>(`${this.apiUrl}/url`, request);
  }

  /**
   * Проверка текста новости
   */
  verifyText(request: VerifyTextRequest): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>(`${this.apiUrl}/text`, request);
  }
}
