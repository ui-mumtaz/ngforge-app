import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneratorService, TYPE_OPTIONS } from '../../generator.service';

@Component({
  selector: 'app-prompt-input',
  imports: [ReactiveFormsModule],
  templateUrl: './prompt-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptInputComponent {
  readonly generator = inject(GeneratorService);
  readonly typeOptions = TYPE_OPTIONS;

  // Not a computed(): it reads a plain FormControl value, which isn't a
  // signal, so a computed() here would memoize once and never update.
  activeConfig() {
    const selected = this.generator.promptForm.controls.type.value;
    return this.typeOptions.find(t => t.type === selected) ?? this.typeOptions[0];
  }

  handleKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (this.generator.promptForm.valid && !this.generator.isGenerating()) {
        this.generator.generate();
      }
    }
  }
}
