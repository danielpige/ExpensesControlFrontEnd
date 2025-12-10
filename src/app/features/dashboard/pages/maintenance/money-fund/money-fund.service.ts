import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse, PagedResult } from '../../../../../core/models/apiResponse.model';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';

@Injectable({
  providedIn: 'root',
})
export class MoneyFundService {
  private baseUrl = 'MoneyFunds';

  constructor(private httpSvc: HttpService) {}

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

  create(dto: MoneyFund) {
    return this.httpSvc.post<ApiResponse<MoneyFund>>(this.baseUrl, dto);
  }

  update(id: number, dto: MoneyFund) {
    return this.httpSvc.put<ApiResponse<MoneyFund>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.httpSvc.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
