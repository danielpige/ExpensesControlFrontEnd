import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { MovementComponent } from './movement/movement.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MovementComponent, GraphicsComponent],
  imports: [CommonModule, ReportRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class ReportModule {}
