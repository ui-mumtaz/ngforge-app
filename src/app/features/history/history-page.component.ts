import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HistoryListComponent } from '../../shared/components/history-list/history-list.component';

@Component({
  selector: 'app-history-page',
  imports: [HistoryListComponent],
  template: `
    <div class="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden" style="height: calc(100vh - 11rem)">
      <app-history-list />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoryPageComponent {}
