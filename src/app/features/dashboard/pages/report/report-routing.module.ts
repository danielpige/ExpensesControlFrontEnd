import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphicsComponent } from './graphics/graphics.component';
import { MovementComponent } from './movement/movement.component';

const routes: Routes = [
  { path: '', component: MovementComponent },
  { path: 'movement', component: MovementComponent },
  { path: 'graphic', component: GraphicsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
