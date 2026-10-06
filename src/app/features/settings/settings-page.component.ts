import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GenerationType } from '../../core/models/angular.models';
import { ThemeService } from '../../core/services/theme.service';
import { SettingsService } from '../../core/services/settings.service';
import { HistoryService } from '../../core/services/history.service';
import { ToastService } from '../../core/services/toast.service';
import { TYPE_OPTIONS } from '../generator/generator.service';

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsPageComponent {
  readonly theme = inject(ThemeService);
  private readonly settings = inject(SettingsService);
  readonly history = inject(HistoryService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly typeOptions = TYPE_OPTIONS;

  readonly form = this.fb.group({
    darkMode: this.fb.control(this.theme.isDark()),
    defaultType: this.fb.control<GenerationType>(this.settings.preferences().defaultType),
    autoOpenPreview: this.fb.control(this.settings.preferences().autoOpenPreview),
  });

  constructor() {
    this.form.controls.darkMode.valueChanges.subscribe(v => this.theme.set(v));
    this.form.controls.defaultType.valueChanges.subscribe(v => this.settings.update({ defaultType: v }));
    this.form.controls.autoOpenPreview.valueChanges.subscribe(v => this.settings.update({ autoOpenPreview: v }));
  }

  clearHistory(): void {
    this.history.clear();
  }

  resetPreferences(): void {
    this.settings.reset();
    this.form.patchValue(this.settings.preferences());
    this.toast.show('Preferences reset to defaults', 'info');
  }
}
