import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { MatDialog } from '@angular/material/dialog';
import { MoneyFundService } from './money-fund.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FormModalMoneyFundComponent } from './form-modal-money-fund/form-modal-money-fund.component';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';
import { Actions, Columns, ColumnTypes } from '../../../../../shared/components/generic-table/generic-table.type';
import { AccountTypeTranslatePipe } from '../../../../../shared/pipes/account-type-translate.pipe';
import { filter, finalize, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-money-fund',
  templateUrl: './money-fund.component.html',
  styleUrl: './money-fund.component.scss',
})
export class MoneyFundComponent {
  private dialog = inject(MatDialog);
  private moneyFundSvc = inject(MoneyFundService);
  private loaderSvc = inject(LoaderService);
  private snackBarSvc = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);
  private title = inject(Title);
  private accountTypeTranslatePipe = inject(AccountTypeTranslatePipe);

  dataSource = signal<MoneyFund[]>([]);
  columns: Columns[] = [
    {
      title: 'Nombre',
      propertyValue: 'Name',
      type: ColumnTypes.TEXT,
    },
    {
      title: 'Tipo de cuenta',
      propertyValue: 'AccountType',
      type: ColumnTypes.TEXT,
    },
    {
      title: 'Balance',
      propertyValue: 'CurrentBalance',
      type: ColumnTypes.MONEY,
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
      isDisabled: (data: MoneyFund) => !data.IsActive,
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

        const sub = this.loadMoneyFunds(index, size);

        onCleanup(() => sub.unsubscribe());
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Fondos monetarios');
    this.forceReload();
  }

  openFormModal(data: MoneyFund | null = null): void {
    const dialog = this.dialog.open(FormModalMoneyFundComponent, {
      width: '700px',
      data,
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

  deleteMoneyFund(moneyFund: MoneyFund): void {
    this.loaderSvc.show();

    const key = uuidv4();

    this.moneyFundSvc
      .delete(moneyFund.Id as number, key)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBarSvc.success('Fondo deshabilitado con éxito.');
          this.loaderSvc.hide();
          this.forceReload();
        },
        error: () => {
          this.loaderSvc.hide();
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

  onSelecteAction(actionEvent: { event: string; item: MoneyFund }): void {
    if (actionEvent.event === 'edit') {
      this.openFormModal(actionEvent.item);
    }

    if (actionEvent.event === 'delete') {
      this.deleteMoneyFund(actionEvent.item);
    }
  }

  private loadMoneyFunds(index: number, size: number): Subscription {
    return this.moneyFundSvc
      .getAllByCurrentUser(index + 1, size)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          const dataMapped = res.Data.Items.map((i) => ({ ...i, AccountType: this.accountTypeTranslatePipe.transform(i.AccountType) }));
          this.dataSource.set(dataMapped);
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
