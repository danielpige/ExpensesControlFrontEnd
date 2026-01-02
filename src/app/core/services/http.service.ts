import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SnackBarService } from './snack-bar.service';
import { environment } from '../../../environments/environment';
import { ApiErrorResponse, ApiResponse } from '../models/apiResponse.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private readonly snackBarSvc = inject(SnackBarService);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  private readonly baseUrl = environment.apiUrl;

  get<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http
      .get<T>(this.baseUrl + url, {
        params: new HttpParams({ fromObject: params }),
        headers: new HttpHeaders(headers),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getBlob(url: string, params?: any, headers?: any): Observable<Blob> {
    return this.http
      .get(this.baseUrl + url, {
        params: new HttpParams({ fromObject: params }),
        headers: new HttpHeaders(headers ?? {}),
        responseType: 'blob',
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  post<T>(url: string, body: any, headers?: any): Observable<T> {
    return this.http
      .post<T>(this.baseUrl + url, body, {
        headers: new HttpHeaders(headers),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<T>(url: string, body: any, headers?: any): Observable<T> {
    return this.http
      .put<T>(this.baseUrl + url, body, {
        headers: new HttpHeaders(headers),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  delete<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http
      .delete<T>(this.baseUrl + url, {
        params: new HttpParams({ fromObject: params }),
        headers: new HttpHeaders(headers),
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
}
