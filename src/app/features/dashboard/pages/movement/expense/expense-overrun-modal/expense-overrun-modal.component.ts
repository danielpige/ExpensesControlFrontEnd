import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BudgetOverrun } from '../../../../../../core/models/expense.model';

@Component({
  selector: 'app-expense-overrun-modal',
  templateUrl: './expense-overrun-modal.component.html',
  styleUrl: './expense-overrun-modal.component.scss',
})
export class ExpenseOverrunModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { overruns: BudgetOverrun[] }) {}
}
