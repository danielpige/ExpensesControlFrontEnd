import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { Deposit } from '../../../../../core/models/deposit.model';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'Deposits';

  create(dto: Deposit, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.postResponse<ApiResponse<Deposit>>(this.baseUrl, dto, { idempotencyKey }));
  }

  getByDateRange(from: string, to: string) {
    return this.httpSvc.get<ApiResponse<Deposit[]>>(`${this.baseUrl}?from=${from}&to=${to}`);
  }
}
