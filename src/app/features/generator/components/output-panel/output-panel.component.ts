import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { GeneratedOutput } from '../../../../core/models/angular.models';
import { HistoryService } from '../../../../core/services/history.service';
import { ExportService } from '../../../../core/services/export.service';
import { ToastService } from '../../../../core/services/toast.service';
import { GeneratorService } from '../../generator.service';
import { CodeViewerComponent } from '../../../../shared/components/code-viewer/code-viewer.component';
import { LivePreviewComponent } from '../live-preview/live-preview.component';

type TabType = 'ts' | 'html' | 'scss' | 'spec' | 'usage';
type LayoutMode = 'split' | 'code-only' | 'preview-only';

@Component({
  selector: 'app-output-panel',
  imports: [ReactiveFormsModule, ClipboardModule, CodeViewerComponent, LivePreviewComponent],
  templateUrl: './output-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputPanelComponent {
  readonly history = inject(HistoryService);
  readonly generator = inject(GeneratorService);
  private readonly exportService = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly output = input.required<GeneratedOutput>();

  readonly activeTab = signal<TabType>('ts');
  readonly layoutMode = signal<LayoutMode>('split');
  readonly showRefineInput = signal(false);

  readonly refineForm = this.fb.group({
    customRefinement: this.fb.control(''),
  });

  readonly refinementPresets = [
    'Make it more accessible (WCAG AA ARIA)',
    'Add reactive form validation & custom validator',
    'Convert to Angular Signals (input/output/computed)',
    'Enforce OnPush change detection & zoneless',
    'Add async validator with debounce',
  ];

  // Plain method (not computed): reads the activeTab signal fine, but keeps
  // parity with how output() input is consumed elsewhere.
  activeCodeContent() {
    const o = this.output();
    switch (this.activeTab()) {
      case 'ts':
        return { code: o.ts, lang: 'typescript', file: `${o.fileName}.ts` };
      case 'html':
        return { code: o.html, lang: 'html', file: `${o.fileName}.html` };
      case 'scss':
        return { code: o.scss, lang: 'scss', file: `${o.fileName}.scss` };
      case 'spec':
        return { code: o.spec, lang: 'typescript', file: `${o.fileName}.spec.ts` };
      case 'usage':
        return { code: o.usage, lang: 'markdown', file: 'README.md' };
    }
  }

  combinedFiles(): string {
    return this.exportService.combinedFilesText(this.output());
  }

  onCopyAll(success: boolean): void {
    if (!success) return;
    this.toast.show('Copied all Angular files to clipboard', 'success');
  }

  downloadZip(): void {
    this.exportService.downloadZip(this.output());
  }

  applyCustomRefine(): void {
    const value = this.refineForm.controls.customRefinement.value.trim();
    if (value) {
      this.generator.generate(value);
      this.refineForm.reset();
      this.showRefineInput.set(false);
    }
  }
}
