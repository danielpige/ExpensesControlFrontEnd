import { Component, inject, signal } from '@angular/core';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { MatDialog } from '@angular/material/dialog';
import { MoneyFundService } from './money-fund.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FormModalMoneyFundComponent } from './form-modal-money-fund/form-modal-money-fund.component';
import { PageEvent } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';

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

  private title = inject(Title);
  displayedColumns = ['name', 'accountType', 'currentBalance', 'isActive', 'actions'];
  dataSource = signal<MoneyFund[]>([]);
  pagination: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.title.setTitle('Fondos monetarios');
    this.loadMoneyFunds();
  }

  openFormModal(data: MoneyFund | null = null): void {
    const dialog = this.dialog.open(FormModalMoneyFundComponent, {
      width: '700px',
      data,
    });

    dialog.afterClosed().subscribe({
      next: (refresh: boolean | undefined) => {
        if (refresh) {
          this.loadMoneyFunds();
        }
      },
    });
  }

  loadMoneyFunds(): void {
    this.loaderSvc.show();

    this.moneyFundSvc.getAllByCurrentUser(this.pagination.pageIndex + 1, this.pagination.pageSize).subscribe({
      next: (res) => {
        this.dataSource.set(res.Data.Items);
        this.pagination.length = res.Data.TotalCount;
        this.pagination.pageIndex = res.Data.PageNumber - 1;
        this.pagination.pageSize = res.Data.PageSize;
        this.loaderSvc.hide();
      },
      error: () => {
        this.dataSource.set([]);
        this.loaderSvc.hide();
      },
    });
  }

  deleteMoneyFund(moneyFund: MoneyFund): void {
    this.loaderSvc.show();

    this.moneyFundSvc.delete(moneyFund.Id as number).subscribe({
      next: () => {
        this.snackBarSvc.success('Fondo deshabilitado con éxito.');
        this.loaderSvc.hide();
        this.loadMoneyFunds();
      },
      error: () => {
        this.loaderSvc.hide();
      },
    });
  }

  chagePagination(event: PageEvent): void {
    this.pagination = event;
    this.loadMoneyFunds();
  }
}
