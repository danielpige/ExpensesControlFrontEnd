import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';

@Injectable({
  providedIn: 'root',
})
export class MoneyFundService {
  private baseUrl = 'MoneyFunds';

  constructor(private httpSvc: HttpService) {}

  getActives() {
    return this.httpSvc.get<ApiResponse<MoneyFund[]>>(`${this.baseUrl}/active`);
  }

  getAll() {
    return this.httpSvc.get<ApiResponse<MoneyFund[]>>(this.baseUrl);
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
