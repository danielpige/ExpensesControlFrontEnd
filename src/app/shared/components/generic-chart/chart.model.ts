export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartData {
  categories: string[];
  series: ChartSeries[];
}
