import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ExpenseType } from '../../../../../core/models/expenseType.model';
import { MatDialog } from '@angular/material/dialog';
import { FormModalComponent } from './form-modal/form-modal.component';
import { ExpenseTypeService } from './expense-type.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Columns, ColumnTypes, Actions } from '../../../../../shared/components/generic-table/generic-table.type';
import { filter, finalize, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-expense-type',
  templateUrl: './expense-type.component.html',
  styleUrl: './expense-type.component.scss',
})
export class ExpenseTypeComponent implements OnInit {
  private dialog = inject(MatDialog);
  private expenseTypeSvc = inject(ExpenseTypeService);
  private loaderSvc = inject(LoaderService);
  private snackBarSvc = inject(SnackBarService);
  private title = inject(Title);
  private destroyRef = inject(DestroyRef);

  dataSource = signal<ExpenseType[]>([]);
  columns: Columns[] = [
    {
      title: 'Código',
      propertyValue: 'Code',
      type: ColumnTypes.TEXT,
    },
    {
      title: 'Nombre',
      propertyValue: 'Name',
      type: ColumnTypes.TEXT,
    },
    {
      title: 'Estado',
      propertyValue: 'IsActive',
      type: ColumnTypes.BOOLEAN,
    },
  ];
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
      isDisabled: (data: ExpenseType) => !data.IsActive,
    },
  ];
  loading = signal<boolean>(false);
  pageIndex = signal(0);
  pageSize = signal(10);
  length = signal(0);
  refreshKey = signal(0);

  pageEvent = computed<PageEvent>(() => ({
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
    length: this.length(),
  }));

  constructor() {
    effect(
      (onCleanup) => {
        const index = this.pageIndex();
        const size = this.pageSize();
        this.refreshKey();

        this.loading.set(true);

        const sub = this.loadExpenseypes(index, size);

        onCleanup(() => sub.unsubscribe());
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Tipos de gastos');
  }

  openFormModal(data: ExpenseType | null = null): void {
    const dialog = this.dialog.open(FormModalComponent, {
      width: '700px',
      data,
    });

    dialog
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe({
        next: (refresh: boolean) => {
          this.forceReload();
        },
      });
  }

  deleteExpense(expenseType: ExpenseType): void {
    this.loaderSvc.show();

    this.expenseTypeSvc
      .delete(expenseType.Id as number)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderSvc.hide())
      )
      .subscribe({
        next: () => {
          this.snackBarSvc.success('Tipo de gasto deshabilitado con éxito.');
          this.forceReload();
        },
      });
  }

  chagePagination(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  forceReload(): void {
    this.refreshKey.update((v) => v + 1);
  }

  onSelecteAction(actionEvent: { event: string; item: ExpenseType }): void {
    if (actionEvent.event === 'edit') {
      this.openFormModal(actionEvent.item);
    }

    if (actionEvent.event === 'delete') {
      this.deleteExpense(actionEvent.item);
    }
  }

  private loadExpenseypes(index: number, size: number): Subscription {
    return this.expenseTypeSvc
      .getAllByCurrentUser(index + 1, size)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false))
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
}
