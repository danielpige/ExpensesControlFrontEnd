import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, input } from '@angular/core';
import { Actions } from '../generic-table.type';

@Component({
  selector: 'app-row-actions',
  templateUrl: './row-actions.component.html',
  styleUrl: './row-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsComponent {
  actions = input.required<Actions[]>();
  data = input.required<any>();

  disabledMap = computed(() => {
    const row = this.data();
    const actions = this.actions();

    const map = new Map<string, boolean>();
    for (const a of actions) map.set(a.event, a.isDisabled?.(row) ?? false);
    return map;
  });

  @Output() selectedAction = new EventEmitter<string>();

  setAction(event: string): void {
    this.selectedAction.emit(event);
  }
}
