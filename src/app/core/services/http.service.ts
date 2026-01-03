import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, defer, EMPTY, expand, last, map, Observable, switchMap, throwError, timer } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { environment } from '../../../environments/environment';
import { ApiErrorResponse, ApiResponse } from '../models/apiResponse.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

type HttpOptions = {
  params?: any;
  headers?: Record<string, string>;
  idempotencyKey?: string;
};

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private readonly snackBarSvc = inject(SnackBarService);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  private readonly baseUrl = environment.apiUrl;

  get<T>(url: string, params?: any, options?: HttpOptions): Observable<T> {
    return this.http
      .get<T>(this.baseUrl + url, {
        params: new HttpParams({ fromObject: params }),
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getBlob(url: string, params?: any, options?: HttpOptions): Observable<Blob> {
    return this.http
      .get(this.baseUrl + url, {
        params: new HttpParams({ fromObject: options?.params }),
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getBlobReponse(url: string, params?: any, options?: HttpOptions): Observable<HttpResponse<Blob>> {
    return this.http
      .get(this.baseUrl + url, {
        observe: 'response',
        params: new HttpParams({ fromObject: options?.params }),
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http
      .post<T>(this.baseUrl + url, body, {
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        params: new HttpParams({ fromObject: options?.params }),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  postResponse<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>> {
    return this.http
      .post<T>(this.baseUrl + url, body, {
        observe: 'response',
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        params: new HttpParams({ fromObject: options?.params }),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http
      .put<T>(this.baseUrl + url, body, {
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        params: new HttpParams({ fromObject: options?.params }),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  putResponse<T>(url: string, body: any, options?: HttpOptions): Observable<HttpResponse<T>> {
    return this.http
      .put<T>(this.baseUrl + url, body, {
        observe: 'response',
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
        params: new HttpParams({ fromObject: options?.params }),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http
      .delete<T>(this.baseUrl + url, {
        params: new HttpParams({ fromObject: options?.params }),
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteResponse<T>(url: string, options?: HttpOptions): Observable<HttpResponse<T>> {
    return this.http
      .delete<T>(this.baseUrl + url, {
        observe: 'response',
        params: new HttpParams({ fromObject: options?.params }),
        headers: this.buildHeaders(options?.headers, options?.idempotencyKey),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (!environment.production) {
      console.error('[HTTP ERROR]:', error);
    }

    if (error?.status === 401) {
      this.authSvc.logout();
      this.router.navigate(['/auth/login']);
    }

    const backendError = error?.error as ApiErrorResponse | undefined;

    const message = backendError?.Message || (error?.error as any)?.message || 'Ha ocurrido un error inesperado.';

    this.snackBarSvc.error(!environment.production ? message : 'Parece que algo ha salido mal, vuelve a intentarlo más tarde.');

    return throwError(() => backendError ?? error);
  }

  private buildHeaders(headers?: Record<string, string>, idempotencyKey?: string): HttpHeaders {
    let h = new HttpHeaders(headers ?? {});
    if (idempotencyKey) h = h.set('Idempotency-Key', idempotencyKey);
    return h;
  }

  idempotent<T>(requestFactory: () => Observable<HttpResponse<T>>, maxAttempts = 10): Observable<T> {
    return defer(requestFactory).pipe(
      expand((resp, i) => {
        if (resp.status !== 202) return EMPTY;
        if (i >= maxAttempts - 1) return EMPTY;

        const retryAfterHeader = resp.headers.get('Retry-After');
        const retryAfterSec = Number(retryAfterHeader ?? '1');
        const delayMs = Number.isFinite(retryAfterSec) ? Math.max(200, retryAfterSec * 1000) : 1000;

        return timer(delayMs).pipe(switchMap(() => requestFactory()));
      }),
      last(),
      map((resp) => {
        if (resp.status === 202) {
          this.snackBarSvc.info('La operación sigue en proceso. Intenta nuevamente.');
        }
        return resp.body as T;
      })
    );
  }
}
