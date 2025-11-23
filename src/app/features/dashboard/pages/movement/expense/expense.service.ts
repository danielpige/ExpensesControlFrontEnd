import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { CreateExpenseResponse, Expense } from '../../../../../core/models/expense.model';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseUrl = 'Expenses';

  constructor(private httpSvc: HttpService) {}

  create(dto: Expense) {
    return this.httpSvc.post<ApiResponse<CreateExpenseResponse>>(this.baseUrl, dto);
  }
}
