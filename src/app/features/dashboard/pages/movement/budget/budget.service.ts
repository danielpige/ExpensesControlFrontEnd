import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';
import { Budget } from '../../../../../core/models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private baseUrl = 'Budgets';

  constructor(private httpSvc: HttpService) {}

  getByPeriod(year: number, month: number) {
    return this.httpSvc.get<ApiResponse<Budget[]>>(`${this.baseUrl}?year=${year}&month=${month}`);
  }

  create(dto: Budget) {
    return this.httpSvc.post<ApiResponse<Budget>>(this.baseUrl, dto);
  }

  update(id: number, dto: Budget) {
    return this.httpSvc.put<ApiResponse<Budget>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.httpSvc.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
