import { Injectable } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';
import { BudgetVsExecution } from '../../../../../core/models/graphic.model';

@Injectable({
  providedIn: 'root',
})
export class GraphicsService {
  private baseUrl = 'Reports';

  constructor(private httpSvc: HttpService) {}

  getBudgetVsExecution(from: string, to: string) {
    const url = `${this.baseUrl}/budget-vs-execution?from=${from}&to=${to}`;
    return this.httpSvc.get<ApiResponse<BudgetVsExecution[]>>(url);
  }
}
