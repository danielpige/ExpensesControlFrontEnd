import { Component, computed, OnInit, signal } from '@angular/core';
import { ChartData, ChartType } from '../../../../../shared/components/generic-chart/chart.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GraphicsService } from './graphics.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { BudgetVsExecution } from '../../../../../core/models/graphic.model';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.scss',
})
export class GraphicsComponent implements OnInit {
  form!: FormGroup;

  private budgetVsExecution = signal<BudgetVsExecution[] | null>(null);

  chartData = computed<ChartData | null>(() => {
    const data = this.budgetVsExecution();
    if (!data?.length) return null;

    const categories = data.map((x) => x.ExpenseTypeName);
    const budgets = data.map((x) => x.TotalBudget);
    const executed = data.map((x) => x.TotalExecuted);

    return {
      categories,
      series: [
        { name: 'Presupuesto', data: budgets },
        { name: 'Ejecutado', data: executed },
      ],
    };
  });

  executionShareChartData = computed<ChartData | null>(() => {
    const data = this.budgetVsExecution();
    if (!data?.length) return null;

    const categories = data.map((x) => x.ExpenseTypeName);
    const executed = data.map((x) => x.TotalExecuted);

    return {
      categories,
      series: [{ name: 'Ejecutado', data: executed }],
    };
  });

  usageChartData = computed<ChartData | null>(() => {
    const data = this.budgetVsExecution();
    if (!data?.length) return null;

    const categories: string[] = [];
    const usagePercentages: number[] = [];

    for (const item of data) {
      if (item.TotalBudget <= 0) continue;
      categories.push(item.ExpenseTypeName);
      const usage = (item.TotalExecuted / item.TotalBudget) * 100;
      usagePercentages.push(Number(usage.toFixed(2)));
    }

    return {
      categories,
      series: [{ name: '% de presupuesto usado', data: usagePercentages }],
    };
  });

  constructor(private fb: FormBuilder, private graphicSvc: GraphicsService, private loaderSvc: LoaderService) {}

  ngOnInit(): void {
    this.initForm();
    this.onSearch();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fromDate: [new Date(), Validators.required],
      toDate: [new Date(), Validators.required],
      chartType: ['bar' as ChartType, Validators.required],
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

    const raw = this.form.getRawValue();
    const from = this.toDateOnlyString(raw.fromDate as Date);
    const to = this.toDateOnlyString(raw.toDate as Date);

    this.graphicSvc.getBudgetVsExecution(from, to).subscribe({
      next: (res) => {
        this.budgetVsExecution.set(res.Data);
        this.loaderSvc.hide();
      },
      error: () => {
        this.budgetVsExecution.set([]);
        this.loaderSvc.hide();
      },
    });
  }

  get chartType(): ChartType {
    return this.form.value.chartType as ChartType;
  }
}
