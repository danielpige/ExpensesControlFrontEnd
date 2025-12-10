import { Component, OnInit } from '@angular/core';
import { Budget } from '../../../../../core/models/budget.model';
import { BudgetService } from './budget.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FormModalBudgetComponent } from './form-modal-budget/form-modal-budget.component';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  budgets: Budget[] = [];
  displayedColumns = ['expenseTypeName', 'amount', 'actions'];
  date: FormControl<Date | null> = new FormControl(new Date());

  months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  constructor(
    private budgetSvc: BudgetService,
    private loaderSvc: LoaderService,
    private dialog: MatDialog,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch() {
    if (!this.selectedYear || !this.selectedMonth) return;

    this.loaderSvc.show();

    this.budgetSvc.getByPeriod(this.selectedYear, this.selectedMonth + 1).subscribe({
      next: (res) => {
        this.budgets = res.Data ?? [];
        this.loaderSvc.hide();
      },
      error: () => {
        this.loaderSvc.hide();
      },
    });
  }

  openFormModal(data: Budget | null = null): void {
    const dialog = this.dialog.open(FormModalBudgetComponent, {
      width: '700px',
      data: {
        data,
        year: this.selectedYear,
        month: this.selectedMonth + 1,
      },
    });

    dialog.afterClosed().subscribe({
      next: (refresh: boolean | undefined) => {
        if (refresh) {
          this.onSearch();
        }
      },
    });
  }

  deleteBudget(budget: Budget): void {
    this.loaderSvc.show();

    this.budgetSvc.delete(budget.Id as number).subscribe({
      next: () => {
        this.snackBarSvc.success('presupuesto eliminado con éxito.');
        this.loaderSvc.hide();
        this.onSearch();
      },
      error: () => {
        this.loaderSvc.hide();
      },
    });
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.date?.value ?? new Date();

    ctrlValue.setMonth(normalizedMonthAndYear.getMonth());
    ctrlValue.setFullYear(normalizedMonthAndYear.getFullYear());
    ctrlValue.setDate(1);

    this.selectedMonth = normalizedMonthAndYear.getMonth();
    this.selectedYear = normalizedMonthAndYear.getFullYear();
    this.date?.setValue(ctrlValue);

    datepicker.close();
  }
}
