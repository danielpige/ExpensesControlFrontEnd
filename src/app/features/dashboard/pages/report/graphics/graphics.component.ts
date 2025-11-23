import { Component, OnInit } from '@angular/core';
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

  chartData: ChartData | null = null;
  executionShareChartData: ChartData | null = null;
  usageChartData: ChartData | null = null;

  constructor(private fb: FormBuilder, private graphicSvc: GraphicsService, private loaderSvc: LoaderService) {}

  ngOnInit(): void {
    this.initForm();
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
        this.buildChartData(res.Data);
      },
      error: () => {
        this.loaderSvc.hide();
      },
    });
  }

  buildChartData(data: BudgetVsExecution[]): void {
    if (!data || data.length === 0) {
      this.chartData = null;
      return;
    }

    const categories = data.map((x) => x.ExpenseTypeName);
    const budgets = data.map((x) => x.TotalBudget);
    const executed = data.map((x) => x.TotalExecuted);

    this.chartData = {
      categories,
      series: [
        { name: 'Presupuesto', data: budgets },
        { name: 'Ejecutado', data: executed },
      ],
    };

    this.executionShareChartData = {
      categories,
      series: [{ name: 'Ejecutado', data: executed }],
    };

    this.buildUsageChartData(data);

    this.loaderSvc.hide();
  }

  buildUsageChartData(data: BudgetVsExecution[]): void {
    const categories: string[] = [];
    const usagePercentages: number[] = [];

    for (const item of data) {
      if (item.TotalBudget <= 0) continue;

      categories.push(item.ExpenseTypeName);
      const usage = (item.TotalExecuted / item.TotalBudget) * 100;
      usagePercentages.push(Number(usage.toFixed(2)));
    }

    this.usageChartData = {
      categories,
      series: [{ name: '% de presupuesto usado', data: usagePercentages }],
    };
  }

  get chartType(): ChartType {
    return this.form.value.chartType as ChartType;
  }
}
