import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse, PagedResult } from '../../../../../core/models/apiResponse.model';
import { Budget } from '../../../../../core/models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'Budgets';

  getByPeriod(year: number, month: number, pageIndex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<Budget>>>(
      `${this.baseUrl}?year=${year}&month=${month}&pageNumber=${pageIndex}&pageSize=${pageSize}`
    );
  }

  create(dto: Budget, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.postResponse<ApiResponse<Budget>>(this.baseUrl, dto, { idempotencyKey }));
  }

  update(id: number, dto: Budget, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.putResponse<ApiResponse<Budget>>(`${this.baseUrl}/${id}`, dto, { idempotencyKey }));
  }

  delete(id: number, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.deleteResponse<ApiResponse<void>>(`${this.baseUrl}/${id}`, { idempotencyKey }));
  }
}
