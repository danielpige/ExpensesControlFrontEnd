import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { CreateExpenseResponse, Expense } from '../../../../../core/models/expense.model';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'Expenses';

  constructor() {}

  create(dto: Expense) {
    return this.httpSvc.post<ApiResponse<CreateExpenseResponse>>(this.baseUrl, dto);
  }
}
