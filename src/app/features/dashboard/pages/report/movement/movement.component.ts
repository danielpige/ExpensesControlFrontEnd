import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovementService } from './movement.service';
import { MoneyFundService } from '../../maintenance/money-fund/money-fund.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { MoneyFund } from '../../../../../core/models/moneyFund.model';
import { Movement, MovementType } from '../../../../../core/models/movement.model';
import { LoaderService } from '../../../../../core/services/loader.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.scss',
})
export class MovementComponent {
  private fb = inject(FormBuilder);
  private movementSvc = inject(MovementService);
  private moneyFundSvc = inject(MoneyFundService);
  private laoderSvc = inject(LoaderService);

  private title = inject(Title);
  form!: FormGroup;

  moneyFunds = signal<MoneyFund[]>([]);
  movements: Movement[] = [];
  filteredMovements = signal<Movement[]>([]);

  displayedColumns = ['date', 'movementType', 'moneyFundName', 'amount', 'description'];

  totalDeposits = signal<number>(0);
  totalExpenses = signal<number>(0);
  netBalance = signal<number>(0);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.title.setTitle('Consulta de movimientos');
    this.initForm();
    this.loadMoneyFunds();
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
    this.laoderSvc.show();

    this.moneyFundSvc.getActivesByCurrentUser().subscribe({
      next: (res) => {
        this.moneyFunds.set(res.Data ?? []);
        this.laoderSvc.hide();
      },
      error: () => {
        this.laoderSvc.hide();
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

    this.laoderSvc.show();

    const raw = this.form.getRawValue();
    const from = this.toDateOnlyString(raw.fromDate as Date);
    const to = this.toDateOnlyString(raw.toDate as Date);
    const moneyFundId = raw.moneyFundId || undefined;

    this.movementSvc.getByDateRange(from, to, moneyFundId).subscribe({
      next: (res) => {
        this.movements = res.Data;
        this.applyFilter();
        this.calculateTotals();
        this.laoderSvc.hide();
      },
      error: () => {
        this.laoderSvc.hide();
      },
    });
  }

  applyFilter(): void {
    const typeFilter = this.form.value.movementType;
    if (!typeFilter || typeFilter === 'All') {
      this.filteredMovements.set([...this.movements]);
    } else {
      this.filteredMovements.set(this.movements.filter((m) => m.MovementType === typeFilter));
    }
  }

  onMovementTypeChange(): void {
    this.applyFilter();
    this.calculateTotals();
  }

  private calculateTotals(): void {
    let deposits = 0;
    let expenses = 0;

    for (const m of this.filteredMovements()) {
      if (m.MovementType === 'Deposit') {
        deposits += m.Amount;
      } else if (m.MovementType === 'Expense') {
        expenses += m.Amount;
      }
    }

    this.totalDeposits.set(deposits);
    this.totalExpenses.set(expenses);
    this.netBalance.set(deposits - expenses);
  }
}
