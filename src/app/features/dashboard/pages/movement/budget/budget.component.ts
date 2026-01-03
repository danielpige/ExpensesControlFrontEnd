import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Budget } from '../../../../../core/models/budget.model';
import { BudgetService } from './budget.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FormModalBudgetComponent } from './form-modal-budget/form-modal-budget.component';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, finalize } from 'rxjs';
import { Actions, Columns, ColumnTypes } from '../../../../../shared/components/generic-table/generic-table.type';
import { PageEvent } from '@angular/material/paginator';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  private budgetSvc = inject(BudgetService);
  private loaderSvc = inject(LoaderService);
  private dialog = inject(MatDialog);
  private snackBarSvc = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);
  private title = inject(Title);

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  dataSource = signal<Budget[]>([]);
  actions: Actions[] = [
    {
      title: 'Editar',
      event: 'edit',
      icon: 'edit',
    },
    {
      title: 'Deshabilitar',
      event: 'delete',
      icon: 'delete_forever',
    },
  ];
  columns: Columns[] = [
    {
      title: 'Tipo de gasto',
      propertyValue: 'ExpenseTypeName',
      type: ColumnTypes.TEXT,
    },
    {
      title: 'Monto',
      propertyValue: 'Amount',
      type: ColumnTypes.MONEY,
    },
  ];
  loading = signal(true);
  pageIndex = signal(0);
  pageSize = signal(10);
  length = signal(0);
  refreshKey = signal(0);

  pageEvent = computed<PageEvent>(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    length: this.length(),
  }));
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

  constructor() {
    effect(
      (onCleanup) => {
        const index = this.pageIndex();
        const size = this.pageSize();
        this.refreshKey();

        this.loading.set(true);

        const sub = this.onSearch(index, size);

        onCleanup(() => sub.unsubscribe());
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Presupuestos');
  }

  onSearch(index: number, size: number) {
    return this.budgetSvc
      .getByPeriod(this.selectedYear, this.selectedMonth, index + 1, size)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (res) => {
          this.dataSource.set(res.Data.Items);
          this.length.set(res.Data.TotalCount);

          const serverIndex = res.Data.PageNumber - 1;
          const serverSize = res.Data.PageSize;

          if (this.pageIndex() !== serverIndex) this.pageIndex.set(serverIndex);
          if (this.pageSize() !== serverSize) this.pageSize.set(serverSize);
        },
        error: () => {
          this.dataSource.set([]);
        },
      });
  }

  openFormModal(data: Budget | null = null): void {
    const dialog = this.dialog.open(FormModalBudgetComponent, {
      width: '700px',
      data: {
        data,
        year: this.selectedYear,
        month: this.selectedMonth,
      },
    });

    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe({
        next: () => {
          this.forceReload();
        },
      });
  }

  deleteBudget(budget: Budget): void {
    this.loaderSvc.show();

    const key = uuidv4();

    this.budgetSvc
      .delete(budget.Id as number, key)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderSvc.hide())
      )
      .subscribe({
        next: () => {
          this.snackBarSvc.success('presupuesto eliminado con éxito.');
          this.forceReload();
        },
      });
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Date>) {
    const year = normalizedMonthAndYear.getFullYear();
    const monthIndex = normalizedMonthAndYear.getMonth();

    this.selectedYear = year;
    this.selectedMonth = monthIndex + 1;

    this.date.setValue(new Date(year, monthIndex, 1));

    datepicker.close();
  }

  onSelecteAction(actionEvent: { event: string; item: Budget }): void {
    if (actionEvent.event === 'edit') {
      this.openFormModal(actionEvent.item);
    }

    if (actionEvent.event === 'delete') {
      this.deleteBudget(actionEvent.item);
    }
  }

  forceReload(): void {
    this.refreshKey.update((v) => v + 1);
  }

  chagePagination(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
