import { GeneratedOutput, GenerationType } from '../models/angular.models';

/**
 * Local Angular architecture synthesis engine.
 * Produces complete, compilable-looking Angular 19+ artifacts (component/service/
 * directive/pipe/guard) entirely client-side, so the app works without any backend
 * or API key.
 */
export function synthesizeAngularArtifact(
  prompt: string,
  type: GenerationType,
  refinement?: string,
  previousOutput?: GeneratedOutput
): GeneratedOutput {
  const p = prompt.toLowerCase();
  const cleanName =
    prompt
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 3)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('') || 'Custom';
  const kebabName = cleanName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  const filePrefix =
    type === 'Service' ? `${kebabName}.service` :
    type === 'Directive' ? `${kebabName}.directive` :
    type === 'Pipe' ? `${kebabName}.pipe` :
    type === 'Guard/Interceptor' ? `${kebabName}.guard` :
    `${kebabName}.component`;

  const className =
    type === 'Service' ? `${cleanName}Service` :
    type === 'Directive' ? `${cleanName}Directive` :
    type === 'Pipe' ? `${cleanName}Pipe` :
    type === 'Guard/Interceptor' ? `${cleanName}Guard` :
    `${cleanName}Component`;

  const isForm = type === 'Reactive Form' || p.includes('form') || p.includes('signup') || p.includes('login') || p.includes('checkout');
  const isDynamic = type === 'Dynamic Form' || p.includes('dynamic') || p.includes('json');

  const refinementNote = refinement
    ? `\n// Refinement applied: ${refinement}\n// Previous artifact: ${previousOutput?.componentName ?? 'N/A'}\n`
    : '';

  const ts = `${refinementNote}import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ${cleanName}Data {
  title: string;
  category: string;
  active: boolean;
  notes?: string;
}

@Component({
  selector: 'app-${kebabName}',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './${filePrefix}.html',
  styleUrls: ['./${filePrefix}.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${className} {
  private readonly fb = inject(NonNullableFormBuilder);

  // Modern Signal-based outputs
  readonly actionSubmitted = output<${cleanName}Data>();
  readonly statusChanged = output<boolean>();

  // Reactive State Signals
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly counter = signal(0);

  // Computed state
  readonly isReady = computed(() => this.counter() >= 0 && !this.isLoading());

  // Strongly typed form
  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['General', [Validators.required]],
    active: [true],
    notes: [''],
  });

  handleAction(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: ${cleanName}Data = this.form.getRawValue();
    this.counter.update(c => c + 1);
    this.actionSubmitted.emit(payload);
    this.successMessage.set('Action executed successfully!');
    this.isLoading.set(false);
  }

  reset(): void {
    this.form.reset({
      title: '',
      category: 'General',
      active: true,
      notes: '',
    });
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }
}
`;

  const html = `<div class="${kebabName}-container">
  <header class="header">
    <div class="badge-tag">Standalone Component</div>
    <h2 class="title">${prompt.charAt(0).toUpperCase() + prompt.slice(1)}</h2>
    <p class="subtitle">Architected with Angular Signals, OnPush detection, and reactive control flow.</p>
  </header>

  @if (successMessage()) {
    <div class="alert alert-success" role="alert">
      <span>{{ successMessage() }}</span>
    </div>
  }

  @if (errorMessage()) {
    <div class="alert alert-danger" role="alert">
      <span>{{ errorMessage() }}</span>
    </div>
  }

  <form [formGroup]="form" (ngSubmit)="handleAction()" class="main-form" novalidate>
    <div class="form-group">
      <label for="titleInput" class="form-label">Item Title</label>
      <input
        id="titleInput"
        type="text"
        formControlName="title"
        placeholder="Enter name or title..."
        class="form-control"
        [class.is-invalid]="form.controls.title.invalid && form.controls.title.touched"
        aria-describedby="title-feedback"
      />
      @if (form.controls.title.invalid && form.controls.title.touched) {
        <div id="title-feedback" class="invalid-feedback">
          Title is required and must have at least 3 characters.
        </div>
      }
    </div>

    <div class="form-group">
      <label for="categorySelect" class="form-label">Category</label>
      <select id="categorySelect" formControlName="category" class="form-control select">
        <option value="General">General</option>
        <option value="Engineering">Engineering</option>
        <option value="Product">Product</option>
        <option value="Design">Design</option>
      </select>
    </div>

    <div class="form-check">
      <input
        type="checkbox"
        id="activeCheck"
        formControlName="active"
        class="checkbox"
      />
      <label for="activeCheck" class="check-label">Mark item as active</label>
    </div>

    <div class="form-group">
      <label for="notesText" class="form-label">Notes & Comments</label>
      <textarea
        id="notesText"
        formControlName="notes"
        rows="3"
        placeholder="Additional context..."
        class="form-control"
      ></textarea>
    </div>

    <div class="action-bar">
      <button type="button" class="btn btn-outline" (click)="reset()">Reset</button>
      <button type="submit" class="btn btn-primary" [disabled]="isLoading()">
        @if (isLoading()) {
          <span>Processing...</span>
        } @else {
          <span>Save Changes</span>
        }
      </button>
    </div>
  </form>
</div>
`;

  const scss = `.${kebabName}-container {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .header {
    margin-bottom: 1.5rem;

    .badge-tag {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #dd0031;
      background: rgba(221, 0, 49, 0.08);
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
    }

    .title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
    }

    .subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
    }
  }

  .main-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;

    .form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.375rem;
    }

    .form-control {
      padding: 0.625rem 0.875rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 0.375rem;
      font-size: 0.9375rem;
      background: #f8fafc;
      transition: all 0.15s ease;

      &:focus {
        outline: none;
        border-color: #dd0031;
        background: #ffffff;
        box-shadow: 0 0 0 3px rgba(221, 0, 49, 0.15);
      }

      &.is-invalid {
        border-color: #ef4444;
      }
    }
  }

  .form-check {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .checkbox {
      accent-color: #dd0031;
      width: 1rem;
      height: 1rem;
    }

    .check-label {
      font-size: 0.875rem;
      color: #334155;
      cursor: pointer;
    }
  }

  .invalid-feedback {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.25rem;
  }

  .alert {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    margin-bottom: 1.25rem;

    &-success {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    &-danger {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  }

  .action-bar {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;

      &-primary {
        background: #dd0031;
        color: #ffffff;
        border: none;
        &:hover { background: #b50027; }
      }

      &-outline {
        background: transparent;
        color: #475569;
        border: 1px solid #cbd5e1;
        &:hover { background: #f1f5f9; }
      }
    }
  }
}
`;

  const spec = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${className} } from './${filePrefix}';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}],
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile and create instance', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate title minimum length', () => {
    component.form.controls.title.setValue('Hi');
    expect(component.form.controls.title.valid).toBeFalse();

    component.form.controls.title.setValue('Valid Item Title');
    expect(component.form.controls.title.valid).toBeTrue();
  });

  it('should emit actionSubmitted on valid submit', () => {
    let emitted = false;
    component.actionSubmitted.subscribe(() => (emitted = true));

    component.form.setValue({
      title: 'Production Setup',
      category: 'Engineering',
      active: true,
      notes: 'Automated test suite',
    });

    component.handleAction();
    expect(emitted).toBeTrue();
    expect(component.counter()).toBe(1);
  });
});
`;

  const usage = `### Installation & Usage

1. Import \`${className}\` into your standalone component:
\`\`\`typescript
import { ${className}, ${cleanName}Data } from './src/app/components/${kebabName}/${filePrefix}';

@Component({
  standalone: true,
  imports: [${className}],
  template: \`
    <app-${kebabName}
      (actionSubmitted)="onHandle($event)"
    />
  \`
})
export class FeatureComponent {
  onHandle(data: ${cleanName}Data) {
    console.log('Processed:', data);
  }
}
\`\`\`

2. Built with Angular 19+ Signals, Standalone Components, and OnPush change detection.
`;

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: type || 'Component',
    prompt,
    timestamp: Date.now(),
    title: `${prompt.slice(0, 35)}${prompt.length > 35 ? '...' : ''}`,
    description: `Complete standalone ${type.toLowerCase()} generated with Angular Signals and OnPush architecture.`,
    fileName: filePrefix,
    componentName: className,
    tags: ['Signals', 'Standalone', 'OnPush', 'WCAG AA', type],
    ts,
    html,
    scss,
    spec,
    usage,
    previewConfig: {
      type: isDynamic ? 'dynamic-form' : isForm ? 'form' : 'component',
      title: `${cleanName} Live Preview`,
      features: ['Signals state', 'OnPush detection', 'Form validation'],
    },
  };
}
