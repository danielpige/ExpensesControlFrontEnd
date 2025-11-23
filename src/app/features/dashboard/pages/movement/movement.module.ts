import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovementRoutingModule } from './movement-routing.module';
import { BudgetComponent } from './budget/budget.component';
import { ExpenseComponent } from './expense/expense.component';
import { DepositComponent } from './deposit/deposit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { FormModalBudgetComponent } from './budget/form-modal-budget/form-modal-budget.component';
import { ExpenseOverrunModalComponent } from './expense/expense-overrun-modal/expense-overrun-modal.component';

@NgModule({
  declarations: [BudgetComponent, ExpenseComponent, DepositComponent, FormModalBudgetComponent, ExpenseOverrunModalComponent],
  imports: [CommonModule, MovementRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class MovementModule {}
