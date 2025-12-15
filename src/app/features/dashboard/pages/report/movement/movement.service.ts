import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';
import { Movement } from '../../../../../core/models/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'Movements';

  constructor() {}

  getByDateRange(from: string, to: string, moneyFundId?: number) {
    let url = `${this.baseUrl}?from=${from}&to=${to}`;
    if (moneyFundId) {
      url += `&moneyFundId=${moneyFundId}`;
    }

    return this.httpSvc.get<ApiResponse<Movement[]>>(url);
  }
}
