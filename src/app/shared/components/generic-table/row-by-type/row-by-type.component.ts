import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Columns, ColumnTypes } from '../generic-table.type';

@Component({
  selector: 'app-row-by-type',
  templateUrl: './row-by-type.component.html',
  styleUrl: './row-by-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowByTypeComponent {
  @Input({ required: true }) column!: Columns;
  @Input({ required: true }) data!: any;
  columnTypes = ColumnTypes;
}
