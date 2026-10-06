import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HistoryService } from '../../core/services/history.service';
import { PromptInputComponent } from './components/prompt-input/prompt-input.component';
import { OutputPanelComponent } from './components/output-panel/output-panel.component';

@Component({
  selector: 'app-generator-page',
  imports: [PromptInputComponent, OutputPanelComponent],
  template: `
    <div class="flex flex-col gap-6">
      <app-prompt-input />
      <div class="flex-1 min-h-[620px]">
        <app-output-panel [output]="history.currentOutput()" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GeneratorPageComponent {
  readonly history = inject(HistoryService);
}
