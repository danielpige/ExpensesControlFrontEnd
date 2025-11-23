import { Component, inject } from '@angular/core';
import { AccountType, AccountTypeEs, MoneyFund } from '../../../../../../core/models/moneyFund.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../../core/services/loader.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { MoneyFundService } from '../money-fund.service';

@Component({
  selector: 'app-form-modal-money-fund',
  templateUrl: './form-modal-money-fund.component.html',
  styleUrl: './form-modal-money-fund.component.scss',
})
export class FormModalMoneyFundComponent {
  readonly dialogRef = inject(MatDialogRef<FormModalMoneyFundComponent>);
  readonly data = inject<MoneyFund>(MAT_DIALOG_DATA);
  accountTypes = Object.values(AccountType);
  accountTypeEs = AccountTypeEs;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loaderSvc: LoaderService,
    private moneyFundSvc: MoneyFundService,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.form.patchValue({
        Name: this.data.Name,
        InitialBalance: this.data.CurrentBalance,
        AccountType: this.data.AccountType,
        IsActive: this.data.IsActive,
      });

      this.InitialBalance?.clearValidators();
      this.InitialBalance?.updateValueAndValidity();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      Name: [null, [Validators.required, Validators.minLength(3)]],
      AccountType: [null, [Validators.required]],
      InitialBalance: [0, [Validators.required, Validators.min(0)]],
      IsActive: [true, []],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const dataForm = this.form.getRawValue();
    const query = this.data ? this.moneyFundSvc.update(this.data.Id as number, dataForm) : this.moneyFundSvc.create(dataForm);

    query.subscribe({
      next: (res) => {
        this.snackBarSvc.success('Los datos han sido guardados con éxito.');
        this.dialogRef.close(true);
        this.loaderSvc.hide();
      },
      error: () => {
        this.snackBarSvc.success('Ocurrió un error al tratar de guardar datos.');
        this.loaderSvc.hide();
      },
    });
  }

  get InitialBalance(): AbstractControl<number> | null {
    return this.form.get('InitialBalance') as AbstractControl<number>;
  }
}
