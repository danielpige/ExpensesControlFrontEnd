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

  create(dto: Expense, idempotencyKey: string) {
    return this.httpSvc.idempotent(() =>
      this.httpSvc.postResponse<ApiResponse<CreateExpenseResponse>>(this.baseUrl, dto, { idempotencyKey })
    );
  }
}
