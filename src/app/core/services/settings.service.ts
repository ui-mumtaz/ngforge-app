import { Injectable, inject, signal } from '@angular/core';
import { GenerationType } from '../models/angular.models';
import { StorageService } from './storage.service';

const SETTINGS_KEY = 'ngforge_settings';

export interface NgForgePreferences {
  defaultType: GenerationType;
  autoOpenPreview: boolean;
}

const DEFAULT_PREFERENCES: NgForgePreferences = {
  defaultType: 'Reactive Form',
  autoOpenPreview: true,
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(StorageService);

  readonly preferences = signal<NgForgePreferences>(
    this.storage.get<NgForgePreferences>(SETTINGS_KEY) ?? DEFAULT_PREFERENCES
  );

  update(partial: Partial<NgForgePreferences>): void {
    this.preferences.update(prev => ({ ...prev, ...partial }));
    this.storage.set(SETTINGS_KEY, this.preferences());
  }

  reset(): void {
    this.preferences.set(DEFAULT_PREFERENCES);
    this.storage.set(SETTINGS_KEY, DEFAULT_PREFERENCES);
  }
}
