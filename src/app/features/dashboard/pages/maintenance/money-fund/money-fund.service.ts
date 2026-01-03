import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse, PagedResult } from '../../../../../core/models/apiResponse.model';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';

@Injectable({
  providedIn: 'root',
})
export class MoneyFundService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'MoneyFunds';

  getActives() {
    return this.httpSvc.get<ApiResponse<MoneyFund[]>>(`${this.baseUrl}/actives`);
  }

  getActivesByCurrentUser() {
    return this.httpSvc.get<ApiResponse<MoneyFund[]>>(`${this.baseUrl}/get-all-by-current-user/actives`);
  }

  getAll(pageindex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<MoneyFund>>>(`${this.baseUrl}?pageNumber=${pageindex}&pageSize=${pageSize}`);
  }

  getAllByCurrentUser(pageindex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<MoneyFund>>>(
      `${this.baseUrl}/get-all-by-current-user?pageNumber=${pageindex}&pageSize=${pageSize}`
    );
  }

  create(dto: MoneyFund, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.postResponse<ApiResponse<MoneyFund>>(this.baseUrl, dto, { idempotencyKey }));
  }

  update(id: number, dto: MoneyFund, idempotencyKey: string) {
    return this.httpSvc.idempotent(() =>
      this.httpSvc.putResponse<ApiResponse<MoneyFund>>(`${this.baseUrl}/${id}`, dto, { idempotencyKey })
    );
  }

  delete(id: number, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.deleteResponse<ApiResponse<void>>(`${this.baseUrl}/${id}`, { idempotencyKey }));
  }
}
