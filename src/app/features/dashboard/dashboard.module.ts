import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, LayoutModule, DashboardRoutingModule, RouterModule, SharedModule],
})
export class DashboardModule {}
