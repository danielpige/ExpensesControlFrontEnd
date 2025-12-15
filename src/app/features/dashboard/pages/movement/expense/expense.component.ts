import { Component, inject, signal } from '@angular/core';
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
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
})
export class ExpenseComponent {
  private fb = inject(FormBuilder);
  private moneyFundSvc = inject(MoneyFundService);
  private expenseTypeSvc = inject(ExpenseTypeService);
  private expenseSvc = inject(ExpenseService);
  private snackBarSvc = inject(SnackBarService);
  private dialog = inject(MatDialog);
  private loaderSvc = inject(LoaderService);

  private title = inject(Title);
  form!: FormGroup;

  moneyFunds = signal<MoneyFund[]>([]);
  expenseTypes = signal<ExpenseType[]>([]);

  documentTypes = signal([
    { value: DocumentType.Receipt, label: 'Recibo' },
    { value: DocumentType.Invoice, label: 'Factura' },
    { value: DocumentType.Other, label: 'Otro' },
  ]);

  constructor() {}

  ngOnInit(): void {
    this.title.setTitle('Gastos');
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
      funds: this.moneyFundSvc.getActivesByCurrentUser(),
      types: this.expenseTypeSvc.getActivesByCurrentUser(),
    }).subscribe(({ funds, types }) => {
      if (funds.Success) {
        this.moneyFunds.set(funds.Data ?? []);
      }
      if (types.Success) {
        this.expenseTypes.set(types.Data ?? []);
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
