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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  create(dto: Expense) {
    return this.httpSvc.post<ApiResponse<CreateExpenseResponse>>(this.baseUrl, dto);
  }
}
