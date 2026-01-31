import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  CalculateRequest,
  CalculateResponse,
  DeleteResponse,
  HealthResponse,
  HistoryItem,
  HistoryResponse,
  Operator,
} from './calculator.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly history = signal<HistoryItem[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  calculate(num1: number, operator: Operator, num2: number): Observable<CalculateResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    const request: CalculateRequest = { num1, operator, num2 };

    return this.http.post<CalculateResponse>(`${this.apiUrl}/calculate`, request).pipe(
      tap(() => {
        this.isLoading.set(false);
        this.loadHistory();
      }),
      catchError((err) => {
        this.isLoading.set(false);
        const message = err.error?.message || 'Error al realizar la operación';
        this.error.set(message);
        throw err;
      })
    );
  }

  loadHistory(): void {
    this.http
      .get<HistoryResponse>(`${this.apiUrl}/history`)
      .pipe(
        map((response) => response.data?.operations ?? []),
        catchError(() => of([]))
      )
      .subscribe((data) => this.history.set(Array.isArray(data) ? data : []));
  }

  getHistoryItem(id: number): Observable<HistoryItem | null> {
    return this.http.get<{ success: boolean; data: HistoryItem }>(`${this.apiUrl}/history/${id}`).pipe(
      map((response) => response.data),
      catchError(() => of(null))
    );
  }

  deleteHistoryItem(id: number): Observable<boolean> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/history/${id}`).pipe(
      tap(() => this.loadHistory()),
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  clearHistory(): Observable<boolean> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/history`).pipe(
      tap(() => this.history.set([])),
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  checkHealth(): Observable<HealthResponse | null> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`).pipe(catchError(() => of(null)));
  }

  getOperatorSymbol(operator: Operator): string {
    const symbols: Record<Operator, string> = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷',
    };
    return symbols[operator];
  }

  formatExpression(item: HistoryItem): string {
    return `${item.num1} ${this.getOperatorSymbol(item.operator)} ${item.num2}`;
  }
}
