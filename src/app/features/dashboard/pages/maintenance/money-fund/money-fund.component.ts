import { Component } from '@angular/core';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { MatDialog } from '@angular/material/dialog';
import { MoneyFundService } from './money-fund.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FormModalMoneyFundComponent } from './form-modal-money-fund/form-modal-money-fund.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-money-fund',
  templateUrl: './money-fund.component.html',
  styleUrl: './money-fund.component.scss',
})
export class MoneyFundComponent {
  displayedColumns = ['name', 'accountType', 'currentBalance', 'isActive', 'actions'];
  dataSource: MoneyFund[] = [];
  pagination: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  };

  constructor(
    private dialog: MatDialog,
    private moneyFundSvc: MoneyFundService,
    private loaderSvc: LoaderService,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
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

    this.moneyFundSvc.getAll(this.pagination.pageIndex + 1, this.pagination.pageSize).subscribe({
      next: (res) => {
        this.dataSource = res.Data.Items;
        this.pagination.length = res.Data.TotalCount;
        this.pagination.pageIndex = res.Data.PageNumber - 1;
        this.pagination.pageSize = res.Data.PageSize;
        this.loaderSvc.hide();
      },
      error: (error) => {
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
        this.snackBarSvc.error('Ocurrió un error al tratar de eliminar el fondo.');
        this.loaderSvc.hide();
      },
    });
  }

  chagePagination(event: PageEvent): void {
    this.pagination = event;
    this.loadMoneyFunds();
  }
}
