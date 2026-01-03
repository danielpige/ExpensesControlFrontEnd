import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse, PagedResult } from '../../../../../core/models/apiResponse.model';
import { ExpenseType } from '../../../../../core/models/expenseType.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseTypeService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'ExpenseTypes';

  getActives() {
    return this.httpSvc.get<ApiResponse<ExpenseType[]>>(`${this.baseUrl}/actives`);
  }

  getActivesByCurrentUser() {
    return this.httpSvc.get<ApiResponse<ExpenseType[]>>(`${this.baseUrl}/get-all-by-current-user/actives`);
  }

  getAll(pageIndex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<ExpenseType>>>(`${this.baseUrl}?pageNumber=${pageIndex}&pageSize=${pageSize}`);
  }

  getAllByCurrentUser(pageIndex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<ExpenseType>>>(
      `${this.baseUrl}/get-all-by-current-user?pageNumber=${pageIndex}&pageSize=${pageSize}`
    );
  }

  create(dto: ExpenseType, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.postResponse<ApiResponse<ExpenseType>>(this.baseUrl, dto, { idempotencyKey }));
  }

  update(id: number, dto: ExpenseType, idempotencyKey: string) {
    return this.httpSvc.idempotent(() =>
      this.httpSvc.putResponse<ApiResponse<ExpenseType>>(`${this.baseUrl}/${id}`, dto, { idempotencyKey })
    );
  }

  delete(id: number, idempotencyKey: string) {
    return this.httpSvc.idempotent(() => this.httpSvc.deleteResponse<ApiResponse<void>>(`${this.baseUrl}/${id}`, { idempotencyKey }));
  }
}
