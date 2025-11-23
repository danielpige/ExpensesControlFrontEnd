import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Budget } from '../../../../../../core/models/budget.model';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../../core/services/loader.service';
import { BudgetService } from '../budget.service';
import { ExpenseTypeService } from '../../../maintenance/expense-type/expense-type.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { ExpenseType } from '../../../../../../core/models/expenseType.model';

@Component({
  selector: 'app-form-modal-budget',
  templateUrl: './form-modal-budget.component.html',
  styleUrl: './form-modal-budget.component.scss',
})
export class FormModalBudgetComponent {
  readonly dialogRef = inject(MatDialogRef<FormModalBudgetComponent>);
  readonly data = inject<{ data: Budget; month: number; year: number }>(MAT_DIALOG_DATA);
  form!: FormGroup;
  expenseTypes: ExpenseType[] = [];

  constructor(
    private fb: FormBuilder,
    private loaderSvc: LoaderService,
    private budgetSvc: BudgetService,
    private expenseTypeSvc: ExpenseTypeService,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getExpeseTypes();

    if (this.data) {
      this.form.patchValue({
        ExpenseTypeId: this.data.data.ExpenseTypeId,
        Amount: this.data.data.Amount,
        Year: this.data.data.Year,
        Month: this.data.data.Month,
      });
    }
  }

  getExpeseTypes(): void {
    this.expenseTypeSvc.getActives().subscribe({
      next: (res) => {
        this.expenseTypes = res.Data ?? [];
      },
      error: () => {
        this.expenseTypes = [];
      },
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      ExpenseTypeId: [{ value: null, disabled: this.data.data ? true : false }, [Validators.required]],
      Amount: [0, [Validators.required, Validators.min(1)]],
      Year: [this.data.year, [Validators.required]],
      Month: [this.data.month, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    const dataForm = this.form.getRawValue();
    const query = this.data.data ? this.budgetSvc.update(this.data.data.Id as number, dataForm) : this.budgetSvc.create(dataForm);

    query.subscribe({
      next: (res) => {
        this.snackBarSvc.success('Los datos han sido guardados con éxito.');
        this.dialogRef.close(true);
        this.loaderSvc.hide();
      },
      error: (error) => {
        this.snackBarSvc.success(error.error.Message);
        this.loaderSvc.hide();
      },
    });
  }

  get Amount(): AbstractControl<number> | null {
    return this.form.get('Amount') as AbstractControl<number>;
  }

  get Year(): AbstractControl<number> | null {
    return this.form.get('Year') as AbstractControl<number>;
  }

  get Month(): AbstractControl<number> | null {
    return this.form.get('Month') as AbstractControl<number>;
  }
}
