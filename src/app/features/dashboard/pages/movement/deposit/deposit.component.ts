import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { DepositService } from './deposit.service';
import { MoneyFundService } from '../../maintenance/money-fund/money-fund.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss',
})
export class DepositComponent {
  private fb = inject(FormBuilder);
  private depositSvc = inject(DepositService);
  private moneyFundSvc = inject(MoneyFundService);
  private snackBarSvc = inject(SnackBarService);
  private loaderSvc = inject(LoaderService);

  private title = inject(Title);
  form!: FormGroup;

  moneyFunds = signal<MoneyFund[]>([]);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.title.setTitle('Depósitos');
    this.initForm();
    this.loadMoneyFunds();
  }

  private initForm(): void {
    this.form = this.fb.group({
      Date: [new Date(), Validators.required],
      MoneyFundId: [null as number | null, Validators.required],
      Amount: [0, [Validators.required, Validators.min(1)]],
      Comments: [''],
    });
  }

  loadMoneyFunds() {
    this.loaderSvc.show();

    this.moneyFundSvc.getActivesByCurrentUser().subscribe({
      next: (res) => {
        this.moneyFunds.set(res.Data ?? []);
        this.loaderSvc.hide();
      },
      error: () => {
        this.moneyFunds.set([]);
        this.loaderSvc.hide();
      },
    });
  }

  private toDateOnlyString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const dto = this.form.getRawValue();
    dto.Date = this.toDateOnlyString(new Date(dto.Date));

    this.depositSvc.create(dto).subscribe({
      next: (res) => {
        this.snackBarSvc.success('Deposito creado con éxito.');

        this.form.reset({
          date: new Date(),
          amount: 0,
        });
        this.loaderSvc.hide();
      },
      error: () => {
        this.loaderSvc.hide();
      },
    });
  }

  get Amount(): AbstractControl<number> | null {
    return this.form.get('Amount') as AbstractControl<number>;
  }
}
