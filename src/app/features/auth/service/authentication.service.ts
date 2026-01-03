import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { LoginValues, RegisterValues, User, UserResponse } from '../../../core/models/user.model';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../../core/models/apiResponse.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpSvc = inject(HttpService);
  private authSvc = inject(AuthService);

  private readonly ENDPOINTS = {
    REGISTER: 'Auth/register',
    LOGIN: 'Auth/login',
  };

  registerUser(userData: RegisterValues, idempotencyKey: string): Observable<ApiResponse<UserResponse>> {
    return this.httpSvc
      .idempotent(() => this.httpSvc.postResponse<ApiResponse<UserResponse>>(this.ENDPOINTS.REGISTER, userData, { idempotencyKey }))
      .pipe(
        tap((res) => {
          if (res.Success) this.authSvc.setDataUserLogged(res.Data);
        })
      );
  }

  loginUser(userData: LoginValues, idempotencyKey: string): Observable<ApiResponse<UserResponse>> {
    return this.httpSvc
      .idempotent(() => this.httpSvc.postResponse<ApiResponse<UserResponse>>(this.ENDPOINTS.LOGIN, userData, { idempotencyKey }))
      .pipe(
        tap((res) => {
          if (res.Success) this.authSvc.setDataUserLogged(res.Data);
        })
      );
  }
}
