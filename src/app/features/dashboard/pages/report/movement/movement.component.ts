import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovementService } from './movement.service';
import { MoneyFundService } from '../../maintenance/money-fund/money-fund.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { Movement, MovementType } from '../../../../../core/models/movement.model';
import { LoaderService } from '../../../../../core/services/loader.service';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss',
})
export class MovementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movementSvc = inject(MovementService);
  private moneyFundSvc = inject(MoneyFundService);
  private loaderSvc = inject(LoaderService);
  private snackBarSvc = inject(SnackBarService);
  private destroyRef = inject(DestroyRef);

  private title = inject(Title);
  form!: FormGroup;

  moneyFunds = signal<MoneyFund[]>([]);
  movements = signal<Movement[]>([]);

  filteredMovements = computed(() => {
    const list = this.movements();
    const type = this.form.get('movementType')!.value;
    if (!type || type === 'All') return list;
    return list.filter((m) => m.MovementType === type);
  });
  totalDeposits = computed(() =>
    this.filteredMovements().reduce((acc, m) => acc + (m.MovementType === MovementType.DEPOSIT ? m.Amount : 0), 0)
  );
  totalExpenses = computed(() =>
    this.filteredMovements().reduce((acc, m) => acc + (m.MovementType === MovementType.EXPENSE ? m.Amount : 0), 0)
  );
  netBalance = computed(() => this.totalDeposits() - this.totalExpenses());

  readonly displayedColumns = ['date', 'movementType', 'moneyFundName', 'amount', 'description'];

  ngOnInit(): void {
    this.title.setTitle('Consulta de movimientos');
    this.initForm();
    this.loadMoneyFunds();
    this.onSearch();
  }

  initForm(): void {
    this.form = this.fb.group({
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
      moneyFundId: [null as number | null],
      movementType: ['All'],
    });
  }

  loadMoneyFunds(): void {
    this.loaderSvc.show();

    this.moneyFundSvc
      .getActivesByCurrentUser()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderSvc.hide())
      )
      .subscribe({
        next: (res) => {
          this.moneyFunds.set(res.Data ?? []);
        },
        error: () => {
          this.moneyFunds.set([]);
        },
      });
  }

  exportData(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();
    const key = uuidv4();

    this.movementSvc
      .exportData(this.buildQuery.from, this.buildQuery.to, key, this.buildQuery.moneyFundId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderSvc.hide())
      )
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `movements_${this.buildQuery.from.substring(0, 10)}_${this.buildQuery.to.substring(0, 10)}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.snackBarSvc.error('Ocurrió un error al tratar de exportar data.');
        },
      });
  }

  private toDateOnlyString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loaderSvc.show();

    this.movementSvc
      .getByDateRange(this.buildQuery.from, this.buildQuery.to, this.buildQuery.moneyFundId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loaderSvc.hide())
      )
      .subscribe({
        next: (res) => {
          this.movements.set(res.Data);
        },
        error: () => {
          this.movements.set([]);
        },
      });
  }

  private get buildQuery() {
    const raw = this.form.getRawValue();
    return {
      from: this.toDateOnlyString(raw.fromDate as Date),
      to: this.toDateOnlyString(raw.toDate as Date),
      moneyFundId: raw.moneyFundId ?? undefined,
      movementType: raw.movementType as MovementType | 'All',
    };
  }
}
