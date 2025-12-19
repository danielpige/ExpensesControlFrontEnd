import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../../../../core/services/http.service';
import { ApiResponse } from '../../../../../core/models/apiResponse.model';
import { Movement } from '../../../../../core/models/movement.model';
import { Observable } from 'rxjs';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private httpSvc = inject(HttpService);

  private baseUrl = 'Movements';

  constructor() {}

  getByDateRange(from: string, to: string, moneyFundId?: number): Observable<ApiResponse<Movement[]>> {
    let url = `${this.baseUrl}`;
    let params = {
      from: from,
      to: to,
      moneyFundId,
    };

    if (!moneyFundId) {
      delete params.moneyFundId;
    }

    return this.httpSvc.get<ApiResponse<Movement[]>>(url, params);
  }

  exportData(from: string, to: string, moneyFundId?: number): Observable<Blob> {
    let url = `${this.baseUrl}/export`;
    const params = {
      from: from,
      to: to,
      moneyFundId,
    };

    if (!moneyFundId) {
      delete params.moneyFundId;
    }

    return this.httpSvc.getBlob(url, params);
  }
}
