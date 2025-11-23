import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { LoginValues, RegisterValues, User, UserResponse } from '../../../core/models/user.model';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../../../core/models/apiResponse.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly ENDPOINTS = {
    REGISTER: 'Auth/register',
    LOGIN: 'Auth/login',
  };

  constructor(private httpSvc: HttpService, private authSvc: AuthService) {}

  registerUser(userData: RegisterValues): Observable<ApiResponse<UserResponse>> {
    return this.httpSvc.post<ApiResponse<UserResponse>>(this.ENDPOINTS.REGISTER, userData).pipe(
      tap((res) => {
        if (res.Success) {
          this.authSvc.setDataUserLogged(res.Data);
        }
        return res;
      })
    );
  }

  loginUser(userData: LoginValues): Observable<ApiResponse<UserResponse>> {
    return this.httpSvc.post<ApiResponse<UserResponse>>(this.ENDPOINTS.LOGIN, userData).pipe(
      tap((res) => {
        if (res.Success) {
          this.authSvc.setDataUserLogged(res.Data);
        }
        return res;
      })
    );
  }
}
