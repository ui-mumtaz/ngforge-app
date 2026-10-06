import { Injectable, inject, signal } from '@angular/core';
import { GeneratedOutput } from '../models/angular.models';
import { SAMPLE_GENERATIONS } from '../data/sample-generations';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

const HISTORY_KEY = 'ngforge_history';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);

  readonly items = signal<GeneratedOutput[]>([]);
  readonly currentOutput = signal<GeneratedOutput>(SAMPLE_GENERATIONS[0]);
  readonly isDrawerOpen = signal(false);

  constructor() {
    const stored = this.storage.get<GeneratedOutput[]>(HISTORY_KEY);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      this.items.set(stored);
      this.currentOutput.set(stored[0]);
    } else {
      this.items.set(SAMPLE_GENERATIONS);
      this.currentOutput.set(SAMPLE_GENERATIONS[0]);
    }
  }

  /** Adds (or bumps to front if it already exists) a freshly generated artifact. */
  record(output: GeneratedOutput): void {
    this.currentOutput.set(output);
    this.items.update(list => [output, ...list.filter(h => h.id !== output.id)]);
    this.persist();
  }

  select(item: GeneratedOutput): void {
    this.currentOutput.set(item);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update(v => !v);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  toggleFavorite(id: string): void {
    this.items.update(list =>
      list.map(item => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (this.currentOutput().id === id) {
      this.currentOutput.update(curr => ({ ...curr, isFavorite: !curr.isFavorite }));
    }
    this.persist();
  }

  deleteItem(id: string): void {
    this.items.update(list => list.filter(item => item.id !== id));
    this.persist();
  }

  /** Reorders the list — backs the CDK drag-and-drop history list. */
  reorder(previousIndex: number, currentIndex: number): void {
    this.items.update(list => {
      const copy = [...list];
      const [moved] = copy.splice(previousIndex, 1);
      copy.splice(currentIndex, 0, moved);
      return copy;
    });
    this.persist();
  }

  clear(): void {
    this.items.set(SAMPLE_GENERATIONS);
    this.currentOutput.set(SAMPLE_GENERATIONS[0]);
    this.persist();
    this.toast.show('History reset to sample architectures', 'info');
  }

  exportJson(): void {
    const jsonStr = JSON.stringify(this.items(), null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ngforge-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private persist(): void {
    this.storage.set(HISTORY_KEY, this.items());
  }
}
