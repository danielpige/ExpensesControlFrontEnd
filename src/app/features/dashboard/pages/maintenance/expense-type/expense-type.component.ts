import { Component, OnInit } from '@angular/core';
import { ExpenseType } from '../../../../../core/models/expenseType.model';
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ExpenseTypeService } from './expense-type.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrl: './expense-type.component.scss',
})
export class ExpenseTypeComponent implements OnInit {
  displayedColumns = ['code', 'name', 'isActive', 'actions'];
  dataSource: ExpenseType[] = [];

  constructor(
    private dialog: MatDialog,
    private expenseTypeSvc: ExpenseTypeService,
    private loaderSvc: LoaderService,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
    this.loadExpenseTypes();
  }

  openFormModal(data: ExpenseType | null = null): void {
    const dialog = this.dialog.open(FormModalComponent, {
      width: '700px',
      data,
    });

    dialog.afterClosed().subscribe({
      next: (refresh: boolean | undefined) => {
        if (refresh) {
          this.loadExpenseTypes();
        }
      },
    });
  }

  loadExpenseTypes(): void {
    this.loaderSvc.show();

    this.expenseTypeSvc.getAll().subscribe({
      next: (res) => {
        this.dataSource = res.Data;
        this.loaderSvc.hide();
      },
      error: (error) => {
        this.loaderSvc.hide();
      },
    });
  }

  deleteExpense(expenseType: ExpenseType): void {
    this.loaderSvc.show();

    this.expenseTypeSvc.delete(expenseType.Id as number).subscribe({
      next: () => {
        this.snackBarSvc.success('Tipo de gasto deshabilitado con éxito.');
        this.loaderSvc.hide();
        this.loadExpenseTypes();
      },
      error: () => {
        this.snackBarSvc.error('Ocurrió un error al tratar de eliminar el tipo de gasto.');
        this.loaderSvc.hide();
      },
    });
  }
}
