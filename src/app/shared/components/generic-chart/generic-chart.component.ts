import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChartData, ChartType } from './chart.model';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-generic-chart',
  templateUrl: './generic-chart.component.html',
  styleUrl: './generic-chart.component.scss',
})
export class GenericChartComponent implements OnChanges {
  @Input() title = '';
  @Input() type: ChartType = 'bar';
  @Input() data: ChartData | null = null;

  @Output() itemClick = new EventEmitter<{ category: string; serieName?: string }>();

  options: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['type'] || changes['title']) {
      this.buildOptions();
    }
  }

  private buildOptions(): void {
    if (!this.data || !this.data.categories?.length) {
      this.options = {};
      return;
    }

    switch (this.type) {
      case 'bar':
        this.buildBarOrLineOptions('bar');
        break;
      case 'line':
        this.buildBarOrLineOptions('line');
        break;
      case 'pie':
        this.buildPieOptions();
        break;
    }
  }

  private buildBarOrLineOptions(serieType: 'bar' | 'line'): void {
    this.options = {
      tooltip: { trigger: 'axis' },
      legend: {},
      xAxis: {
        type: 'category',
        data: this.data!.categories,
        axisLabel: { rotate: 30 },
      },
      yAxis: {
        type: 'value',
      },
      series: this.data!.series.map((s) => ({
        name: s.name,
        type: serieType,
        data: s.data,
      })),
      grid: { left: 40, right: 20, bottom: 60, top: 40 },
      title: this.title
        ? {
            text: this.title,
            left: 'center',
          }
        : undefined,
    };
  }

  private buildPieOptions(): void {
    const firstSeries = this.data!.series[0];
    const pieData = this.data!.categories.map((cat, i) => ({
      name: cat,
      value: firstSeries.data[i] ?? 0,
    }));

    this.options = {
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: firstSeries.name,
          type: 'pie',
          radius: '60%',
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
      title: this.title
        ? {
            text: this.title,
            left: 'center',
          }
        : undefined,
    };
  }

  onChartClick(event: any): void {
    this.itemClick.emit({
      category: event.name,
      serieName: event.seriesName,
    });
  }
}
