import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { HistoryService } from '../../../core/services/history.service';
import { GeneratedOutput } from '../../../core/models/angular.models';

@Component({
  selector: 'app-history-list',
  imports: [ReactiveFormsModule, CdkDropList, CdkDrag],
  templateUrl: './history-list.component.html',
  host: { class: 'flex flex-col min-h-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListComponent {
  readonly history = inject(HistoryService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  /** Compact mode is used inside the slide-over drawer; full mode on the /history page. */
  readonly compact = input(false);

  readonly filterForm = this.fb.group({
    query: this.fb.control(''),
    favoritesOnly: this.fb.control(false),
  });

  private readonly queryValue = signal('');
  private readonly favoritesOnlyValue = signal(false);

  constructor() {
    this.filterForm.controls.query.valueChanges.subscribe(v => this.queryValue.set(v.toLowerCase().trim()));
    this.filterForm.controls.favoritesOnly.valueChanges.subscribe(v => this.favoritesOnlyValue.set(v));
  }

  /** Reordering maps drop indices onto the unfiltered list, so it's only safe with no active filter. */
  readonly reorderDisabled = computed(() => this.queryValue() !== '' || this.favoritesOnlyValue());

  readonly filteredList = computed(() => {
    const q = this.queryValue();
    const favOnly = this.favoritesOnlyValue();
    return this.history.items().filter(item => {
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.prompt.toLowerCase().includes(q);
      const matchesFavorite = !favOnly || item.isFavorite;
      return matchesQuery && matchesFavorite;
    });
  });

  selectItem(item: GeneratedOutput): void {
    this.history.select(item);
    if (this.compact()) {
      this.history.closeDrawer();
    }
    this.router.navigateByUrl('/generator');
  }

  drop(event: CdkDragDrop<GeneratedOutput[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    this.history.reorder(event.previousIndex, event.currentIndex);
  }
}
