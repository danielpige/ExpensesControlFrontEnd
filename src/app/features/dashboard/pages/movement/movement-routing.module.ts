import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense/expense.component';
import { DepositComponent } from './deposit/deposit.component';
import { BudgetComponent } from './budget/budget.component';

const routes: Routes = [
  { path: '', component: BudgetComponent },
  { path: 'expense', component: ExpenseComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'budget', component: BudgetComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovementRoutingModule {}
