import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { Deposit } from '../../../../../core/models/deposit.model';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private baseUrl = 'Deposits';

  constructor(private httpSvc: HttpService) {}

  create(dto: Deposit) {
    return this.httpSvc.post<ApiResponse<Deposit>>(this.baseUrl, dto);
  }

  getByDateRange(from: string, to: string) {
    return this.httpSvc.get<ApiResponse<Deposit[]>>(`${this.baseUrl}?from=${from}&to=${to}`);
  }
}
