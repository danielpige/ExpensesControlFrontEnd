import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Actions, Columns } from './generic-table.type';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent implements OnChanges {
  @Input({ required: true }) dataSource: any[] = [];
  @Input({ required: true }) columns: Columns[] = [];
  @Input({ required: true }) loading: boolean = false;
  @Input() hasActions = true;
  @Input() actions: Actions[] = [];
  @Input() hasPagination: boolean = true;
  @Input() pageEvent: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
  };

  @Output() refresh = new EventEmitter<void>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() selectedAction = new EventEmitter<{ event: string; item: any }>();
  @Output() paged = new EventEmitter<PageEvent>();

  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['hasActions']) {
      this.buildDisplayedColumns();
    }
  }

  onChangePaginator(event: PageEvent): void {
    this.pageEvent = event;
    this.paged.emit(this.pageEvent);
  }

  onRowClicked(data: string): void {
    this.selectedRow.emit(data);
  }

  onSelectedAction(event: string, item: any): void {
    this.selectedAction.emit({ event, item });
  }

  private buildDisplayedColumns(): void {
    const base = (this.columns ?? []).map((c) => c.propertyValue);
    this.displayedColumns = this.hasActions ? [...base, 'actions'] : base;
  }
}
