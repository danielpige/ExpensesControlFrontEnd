import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyFundService } from '../../maintenance/money-fund/money-fund.service';
import { ExpenseTypeService } from '../../maintenance/expense-type/expense-type.service';
import { ExpenseService } from './expense.service';
import { MatDialog } from '@angular/material/dialog';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { ExpenseType } from '../../../../../core/models/expenseType.model';
import { BudgetOverrun, DocumentType, Expense } from '../../../../../core/models/expense.model';
import { forkJoin } from 'rxjs';
import { ExpenseOverrunModalComponent } from './expense-overrun-modal/expense-overrun-modal.component';
import { LoaderService } from '../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
})
export class ExpenseComponent {
  form!: FormGroup;

  moneyFunds: MoneyFund[] = [];
  expenseTypes: ExpenseType[] = [];

  documentTypes = [
    { value: DocumentType.Receipt, label: 'Recibo' },
    { value: DocumentType.Invoice, label: 'Factura' },
    { value: DocumentType.Other, label: 'Otro' },
  ];

  constructor(
    private fb: FormBuilder,
    private moneyFundSvc: MoneyFundService,
    private expenseTypeSvc: ExpenseTypeService,
    private expenseSvc: ExpenseService,
    private snackBarSvc: SnackBarService,
    private dialog: MatDialog,
    private loaderSvc: LoaderService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSelects();
  }

  initForm(): void {
    this.form = this.fb.group({
      Date: [new Date(), Validators.required],
      MoneyFundId: [null as number | null, Validators.required],
      MerchantName: [''],
      DocumentType: ['Invoice', Validators.required],
      Comments: [''],
      Details: this.fb.array<FormGroup>([], Validators.required),
    });

    this.addDetailRow();
  }

  loadSelects(): void {
    this.loaderSvc.show();
    forkJoin({
      funds: this.moneyFundSvc.getActives(),
      types: this.expenseTypeSvc.getActives(),
    }).subscribe(({ funds, types }) => {
      if (funds.Success) {
        this.moneyFunds = funds.Data ?? [];
      }
      if (types.Success) {
        this.expenseTypes = types.Data ?? [];
      }

      this.loaderSvc.hide();
    });
  }

  addDetailRow(): void {
    const group = this.fb.group({
      ExpenseTypeId: [null as number | null, Validators.required],
      Amount: [0, [Validators.required, Validators.min(1)]],
      Comments: [''],
    });

    this.details.push(group);
  }

  removeDetailRow(index: number): void {
    this.details.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid || this.details.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const dto: Expense = this.form.getRawValue();
    dto.Date = this.toDateOnlyString(new Date(dto.Date));

    this.expenseSvc.create(dto).subscribe({
      next: (res) => {
        const { ExpenseId, Overruns } = res.Data;

        if (Overruns && Overruns.length > 0) {
          this.openOverrunDialog(Overruns);
        } else {
          this.snackBarSvc.success('Gasto registrado con éxito.');
        }

        this.loaderSvc.hide();

        this.resetForm();
      },
      error: (error) => {
        this.snackBarSvc.error(error.error.Message);
      },
    });
  }

  private toDateOnlyString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  resetForm(): void {
    this.form.reset({
      date: new Date(),
      documentType: 'Invoice',
    });
    this.details.clear();
    this.addDetailRow();
  }

  openOverrunDialog(overruns: BudgetOverrun[]): void {
    this.dialog.open(ExpenseOverrunModalComponent, {
      data: { overruns },
      width: '500px',
    });
  }

  get details(): FormArray {
    return this.form.get('Details') as FormArray;
  }
}
