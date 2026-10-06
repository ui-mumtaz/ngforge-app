import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

const THEME_KEY = 'ngforge_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly isDark = signal<boolean>(this.storage.getString(THEME_KEY) !== 'light');

  constructor() {
    this.apply(this.isDark());
  }

  toggle(): void {
    this.isDark.update(prev => !prev);
    this.apply(this.isDark());
    this.storage.setString(THEME_KEY, this.isDark() ? 'dark' : 'light');
  }

  set(dark: boolean): void {
    this.isDark.set(dark);
    this.apply(dark);
    this.storage.setString(THEME_KEY, dark ? 'dark' : 'light');
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
