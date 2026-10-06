import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { HistoryDrawerComponent } from './shared/components/history-drawer/history-drawer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HistoryDrawerComponent, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans transition-colors bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <app-header />

      <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <router-outlet />
      </main>

      <app-history-drawer />
      <app-toast />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // Instantiating ThemeService here applies the persisted theme class on app startup.
  private readonly theme = inject(ThemeService);
}
