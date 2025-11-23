import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { AccountTypeTranslatePipe } from './pipes/account-type-translate.pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { GenericChartComponent } from './components/generic-chart/generic-chart.component';

@NgModule({
  declarations: [LoaderComponent, AccountTypeTranslatePipe, GenericChartComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [CommonModule, MaterialModule, AccountTypeTranslatePipe, GenericChartComponent],
})
export class SharedModule {}
