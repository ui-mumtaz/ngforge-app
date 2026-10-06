import { Injectable, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { GeneratedOutput, GenerationType } from '../../core/models/angular.models';
import { SAMPLE_GENERATIONS } from '../../core/data/sample-generations';
import { AiGeneratorService } from '../../core/services/ai-generator.service';
import { HistoryService } from '../../core/services/history.service';
import { ToastService } from '../../core/services/toast.service';
import { SettingsService } from '../../core/services/settings.service';

export interface TypeOption {
  type: GenerationType;
  label: string;
  badge: string;
  placeholder: string;
}

export const TYPE_OPTIONS: TypeOption[] = [
  {
    type: 'Reactive Form',
    label: 'Reactive Form',
    badge: 'Signals + NonNullableFormBuilder',
    placeholder: 'e.g. Create a signup form with email, password strength meter, terms checkbox...',
  },
  {
    type: 'Dynamic Form',
    label: 'Dynamic Form',
    badge: 'JSON-driven',
    placeholder: 'e.g. Build a dynamic form engine driven by a typed JSON schema supporting conditional visibility...',
  },
  {
    type: 'Component',
    label: 'Component',
    badge: 'Standalone + OnPush',
    placeholder: 'e.g. Build a responsive data table component with signal-based sorting, pagination, and @defer...',
  },
  {
    type: 'Service',
    label: 'Service',
    badge: 'inject(HttpClient) + RxJS',
    placeholder: 'e.g. Generate a service that fetches users with in-memory caching, retry backoff, RxJS shareReplay...',
  },
  {
    type: 'Directive',
    label: 'Directive',
    badge: 'takeUntilDestroyed',
    placeholder: 'e.g. Build an Angular directive that debounces text input events with takeUntilDestroyed...',
  },
  {
    type: 'Pipe',
    label: 'Pipe',
    badge: 'Pure Standalone',
    placeholder: 'e.g. Create a standalone pure pipe that formats byte sizes with unit localization (KB, MB, GB)...',
  },
  {
    type: 'Guard/Interceptor',
    label: 'Guard / Interceptor',
    badge: 'Functional Fn',
    placeholder: 'e.g. Build a functional auth CanActivateFn guard and a functional HTTP token refresh interceptor...',
  },
];

/**
 * Owns the prompt Reactive Form and drives generation requests through
 * AiGeneratorService, recording results into HistoryService.
 */
@Injectable({ providedIn: 'root' })
export class GeneratorService {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly aiGenerator = inject(AiGeneratorService);
  private readonly history = inject(HistoryService);
  private readonly toast = inject(ToastService);
  private readonly settings = inject(SettingsService);

  readonly isGenerating = signal(false);

  readonly promptForm = this.fb.group({
    prompt: this.fb.control(
      'Create a signup form with email, password strength meter, and terms checkbox',
      [Validators.required, Validators.minLength(5)]
    ),
    type: this.fb.control<GenerationType>(this.settings.preferences().defaultType),
  });

  readonly typeOptions = TYPE_OPTIONS;
  readonly sampleList = SAMPLE_GENERATIONS;

  generate(refinementText?: string): void {
    const currentPrompt = this.promptForm.controls.prompt.value;
    const targetPrompt = refinementText ? `${currentPrompt} (${refinementText})` : currentPrompt;
    if (!targetPrompt.trim()) return;

    const type = this.promptForm.controls.type.value;
    const previousOutput = refinementText ? this.history.currentOutput() : undefined;

    this.isGenerating.set(true);
    this.aiGenerator
      .generate({ prompt: targetPrompt, type, refinement: refinementText, previousOutput })
      .pipe(finalize(() => this.isGenerating.set(false)))
      .subscribe({
        next: data => {
          this.history.record(data);
          this.toast.show(
            refinementText
              ? `Architected refinement: ${refinementText}`
              : `Generated ${data.componentName} successfully!`
          );
        },
        error: err => {
          console.error('Generation error', err);
          this.toast.show('Error generating code. Check connection.', 'warning');
        },
      });
  }

  loadSample(sample: GeneratedOutput): void {
    this.history.select(sample);
    this.promptForm.patchValue({ prompt: sample.prompt, type: sample.type });
    this.toast.show(`Loaded preset: ${sample.title}`, 'info');
  }
}
