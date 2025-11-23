import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'movement', pathMatch: 'full' },
      { path: 'maintenance', loadChildren: () => import('./pages/maintenance/maintenance.module').then((m) => m.MaintenanceModule) },
      { path: 'movement', loadChildren: () => import('./pages/movement/movement.module').then((m) => m.MovementModule) },
      { path: 'report', loadChildren: () => import('./pages/report/report.module').then((m) => m.ReportModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
