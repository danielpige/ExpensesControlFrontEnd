import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseType } from '../../../../../../core/models/expenseType.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../../core/services/loader.service';
import { ExpenseTypeService } from '../expense-type.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrl: './form-modal.component.scss',
})
export class FormModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<FormModalComponent>);
  readonly data = inject<ExpenseType>(MAT_DIALOG_DATA);
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loaderSvc: LoaderService,
    private expenseTypeSvc: ExpenseTypeService,
    private snackBarSvc: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.form.patchValue({
        Name: this.data.Name,
        IsActive: this.data.IsActive,
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      Name: [null, [Validators.required, Validators.minLength(3)]],
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
    const query = this.data ? this.expenseTypeSvc.update(this.data.Id as number, dataForm) : this.expenseTypeSvc.create(dataForm);

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
}
