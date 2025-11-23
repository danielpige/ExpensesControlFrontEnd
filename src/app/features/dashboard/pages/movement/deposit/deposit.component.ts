import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { DepositService } from './deposit.service';
import { MoneyFundService } from '../../maintenance/money-fund/money-fund.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { LoaderService } from '../../../../../core/services/loader.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss',
})
export class DepositComponent {
  form!: FormGroup;

  moneyFunds: MoneyFund[] = [];

  constructor(
    private fb: FormBuilder,
    private depositSvc: DepositService,
    private moneyFundSvc: MoneyFundService,
    private snackBarSvc: SnackBarService,
    private loaderSvc: LoaderService
  ) {}

  ngOnInit(): void {
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

    this.moneyFundSvc.getActives().subscribe({
      next: (res) => {
        this.moneyFunds = res.Data ?? [];
        this.loaderSvc.hide();
      },
      error: (error) => {
        this.snackBarSvc.error(error.error.Message);
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
      error: (error) => {
        this.snackBarSvc.error(error.error.Message);
        this.loaderSvc.hide();
      },
    });
  }

  get Amount(): AbstractControl<number> | null {
    return this.form.get('Amount') as AbstractControl<number>;
  }
}
