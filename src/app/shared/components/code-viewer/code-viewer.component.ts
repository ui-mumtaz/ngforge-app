import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastService } from '../../../core/services/toast.service';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

@Component({
  selector: 'app-code-viewer',
  imports: [ClipboardModule],
  templateUrl: './code-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeViewerComponent {
  private readonly toast = inject(ToastService);

  readonly code = input.required<string>();
  readonly language = input<string>('typescript');
  readonly fileName = input<string>('source.ts');

  readonly codeElement = viewChild<ElementRef<HTMLElement>>('codeElement');
  readonly copied = signal(false);

  readonly lines = computed(() => this.code().trim().split('\n'));

  constructor() {
    effect(() => {
      // Re-run Prism highlighting whenever code/language changes.
      this.code();
      this.language();
      setTimeout(() => {
        const el = this.codeElement()?.nativeElement;
        if (el) {
          Prism.highlightElement(el);
        }
      }, 0);
    });
  }

  onCopied(success: boolean): void {
    if (!success) return;
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
    this.toast.show(`Copied ${this.fileName()} to clipboard`, 'success');
  }
}
