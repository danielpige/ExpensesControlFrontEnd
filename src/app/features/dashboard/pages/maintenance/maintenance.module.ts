import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormModalComponent } from './expense-type/form-modal/form-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoneyFundComponent } from './money-fund/money-fund.component';
import { FormModalMoneyFundComponent } from './money-fund/form-modal-money-fund/form-modal-money-fund.component';

@NgModule({
  declarations: [ExpenseTypeComponent, FormModalComponent, MoneyFundComponent, FormModalMoneyFundComponent],
  imports: [CommonModule, MaintenanceRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class MaintenanceModule {}
