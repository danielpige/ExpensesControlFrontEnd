import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';
import { MoneyFundComponent } from './money-fund/money-fund.component';

const routes: Routes = [
  { path: '', component: ExpenseTypeComponent },
  { path: 'expense-type', component: ExpenseTypeComponent },
  { path: 'money-fund', component: MoneyFundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceRoutingModule {}
