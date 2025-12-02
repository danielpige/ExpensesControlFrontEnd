import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse, PagedResult } from '../../../../../core/models/apiResponse.model';
import { ExpenseType } from '../../../../../core/models/expenseType.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseTypeService {
  private baseUrl = 'ExpenseTypes';

  constructor(private httpSvc: HttpService) {}

  getActives() {
    return this.httpSvc.get<ApiResponse<ExpenseType[]>>(`${this.baseUrl}/active`);
  }

  getAll(pageindex: number, pageSize: number) {
    return this.httpSvc.get<ApiResponse<PagedResult<ExpenseType>>>(`${this.baseUrl}?pageNumber=${pageindex}&pageSize=${pageSize}`);
  }

  create(dto: ExpenseType) {
    return this.httpSvc.post<ApiResponse<ExpenseType>>(this.baseUrl, dto);
  }

  update(id: number, dto: ExpenseType) {
    return this.httpSvc.put<ApiResponse<ExpenseType>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.httpSvc.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
