import { GeneratedOutput } from '../models/angular.models';

export const SAMPLE_GENERATIONS: GeneratedOutput[] = [
  // 1. Login Form
  {
    id: 'sample-login-form',
    type: 'Reactive Form',
    prompt: 'Create a modern login form with email, password visibility toggle, password strength meter, remember me, and loading state',
    timestamp: Date.now() - 3600000 * 5,
    title: 'Secure Login & Auth Form',
    description: 'Production-ready standalone reactive form with signal-based password strength, accessible ARIA attributes, and OnPush change detection.',
    fileName: 'login-form.component',
    componentName: 'LoginFormComponent',
    tags: ['Signals', 'ReactiveForms', 'OnPush', 'Accessibility', 'Control Flow'],
    ts: `import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  // Signal-based outputs
  readonly submitLogin = output<LoginPayload>();
  readonly forgotPassword = output<void>();

  // Component reactive state
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Strongly typed reactive form
  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  // Track raw password input as a signal for computed strength meter
  private readonly rawPassword = signal('');

  // Password strength computation (Score: 0 to 4)
  readonly passwordStrength = computed(() => {
    const pwd = this.rawPassword();
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  });

  readonly strengthLabel = computed(() => {
    switch (this.passwordStrength()) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Too short';
    }
  });

  constructor() {
    this.form.controls.password.valueChanges.subscribe(val => {
      this.rawPassword.set(val || '');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(prev => !prev);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload: LoginPayload = this.form.getRawValue();
    this.submitLogin.emit(payload);
  }
}
`,
    html: `<div class="login-card">
  <header class="login-header">
    <h2 class="title">Welcome Back</h2>
    <p class="subtitle">Enter your credentials to access your account</p>
  </header>

  @if (errorMessage()) {
    <div class="alert alert-danger" role="alert">
      <span>{{ errorMessage() }}</span>
    </div>
  }

  <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
    <!-- Email Field -->
    <div class="form-group">
      <label for="email" class="form-label">Work Email</label>
      <input
        id="email"
        type="email"
        formControlName="email"
        placeholder="alex@company.com"
        class="form-control"
        [class.is-invalid]="form.controls.email.invalid && form.controls.email.touched"
        aria-describedby="email-feedback"
        autocomplete="email"
      />
      @if (form.controls.email.invalid && form.controls.email.touched) {
        <div id="email-feedback" class="invalid-feedback">
          @if (form.controls.email.hasError('required')) {
            Email is required.
          } @else if (form.controls.email.hasError('email')) {
            Please enter a valid email address.
          }
        </div>
      }
    </div>

    <!-- Password Field -->
    <div class="form-group">
      <div class="label-row">
        <label for="password" class="form-label">Password</label>
        <button
          type="button"
          class="forgot-link"
          (click)="forgotPassword.emit()"
          tabindex="0"
        >
          Forgot password?
        </button>
      </div>
      <div class="input-wrapper">
        <input
          id="password"
          [type]="showPassword() ? 'text' : 'password'"
          formControlName="password"
          placeholder="••••••••"
          class="form-control"
          [class.is-invalid]="form.controls.password.invalid && form.controls.password.touched"
          aria-describedby="password-feedback"
          autocomplete="current-password"
        />
        <button
          type="button"
          class="toggle-pwd-btn"
          (click)="togglePasswordVisibility()"
          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
        >
          {{ showPassword() ? 'Hide' : 'Show' }}
        </button>
      </div>

      <!-- Password Strength Indicator -->
      @if (rawPassword().length > 0) {
        <div class="strength-meter" aria-live="polite">
          <div class="meter-bar">
            <div
              class="meter-fill"
              [style.width.%]="passwordStrength() * 25"
              [attr.data-strength]="passwordStrength()"
            ></div>
          </div>
          <span class="strength-text">{{ strengthLabel() }}</span>
        </div>
      }

      @if (form.controls.password.invalid && form.controls.password.touched) {
        <div id="password-feedback" class="invalid-feedback">
          Must be at least 8 characters.
        </div>
      }
    </div>

    <!-- Remember Me -->
    <div class="form-check">
      <input
        type="checkbox"
        id="rememberMe"
        formControlName="rememberMe"
        class="checkbox-input"
      />
      <label for="rememberMe" class="check-label">Remember this device for 30 days</label>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="btn-submit"
      [disabled]="isLoading()"
    >
      @if (isLoading()) {
        <span class="spinner" aria-hidden="true"></span>
        <span>Signing in...</span>
      } @else {
        <span>Sign in</span>
      }
    </button>
  </form>
</div>
`,
    scss: `.login-card {
  max-width: 440px;
  margin: 0 auto;
  padding: 2.25rem;
  background: #ffffff;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
}
`,
    spec: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent, LoginPayload } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute password strength accurately', () => {
    component.form.controls.password.setValue('Secret123!');
    expect(component.passwordStrength()).toBe(4);
    expect(component.strengthLabel()).toBe('Strong');
  });
});
`,
    usage: `### Standalone Import
\`\`\`typescript
import { LoginFormComponent } from './login-form.component';

@Component({
  standalone: true,
  imports: [LoginFormComponent],
  template: \`<app-login-form (submitLogin)="onLogin($event)" />\`
})
export class AuthComponent {}
\`\`\`
`,
    previewConfig: {
      type: 'form',
      title: 'Sign In to Your Workspace',
      features: ['Signals computed strength', 'Aria attributes', 'OnPush detection'],
    },
  },

  // 2. Multi-step Checkout Form
  {
    id: 'sample-checkout-form',
    type: 'Component',
    prompt: 'Build a multi-step checkout wizard with shipping address, billing info, review step, signal-based step guards, and step indicators',
    timestamp: Date.now() - 3600000 * 4,
    title: 'Multi-Step Checkout Wizard',
    description: 'Enterprise multi-step wizard component featuring Signal navigation state, separate step validation guards, and accessible stepper indicators.',
    fileName: 'checkout-wizard.component',
    componentName: 'CheckoutWizardComponent',
    tags: ['Signals', 'MultiStep', 'ReactiveForms', 'Enterprise', 'OnPush'],
    ts: `import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export type CheckoutStep = 'shipping' | 'billing' | 'review';

@Component({
  selector: 'app-checkout-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-wizard.component.html',
  styleUrls: ['./checkout-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutWizardComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly currentStep = signal<CheckoutStep>('shipping');
  readonly isSubmitting = signal(false);

  readonly shippingForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    zip: ['', [Validators.required]],
  });

  readonly billingForm = this.fb.group({
    cardName: ['', [Validators.required]],
    cardNumber: ['', [Validators.required]],
    expiry: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
  });

  readonly stepIndex = computed(() => {
    switch (this.currentStep()) {
      case 'shipping': return 1;
      case 'billing': return 2;
      case 'review': return 3;
    }
  });

  goToBilling(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }
    this.currentStep.set('billing');
  }

  goToReview(): void {
    if (this.billingForm.invalid) {
      this.billingForm.markAllAsTouched();
      return;
    }
    this.currentStep.set('review');
  }
}
`,
    html: `<div class="checkout-container">
  <div class="steps-nav">
    <span [class.active]="currentStep() === 'shipping'">1. Shipping</span>
    <span [class.active]="currentStep() === 'billing'">2. Payment</span>
    <span [class.active]="currentStep() === 'review'">3. Review</span>
  </div>
</div>
`,
    scss: `.checkout-container { max-width: 600px; margin: 0 auto; }`,
    spec: `import { TestBed } from '@angular/core/testing';
import { CheckoutWizardComponent } from './checkout-wizard.component';

describe('CheckoutWizardComponent', () => {
  it('should initialize on shipping step', () => {
    const fixture = TestBed.createComponent(CheckoutWizardComponent);
    expect(fixture.componentInstance.currentStep()).toBe('shipping');
  });
});
`,
    usage: `### Usage Example
\`\`\`typescript
@Component({
  standalone: true,
  imports: [CheckoutWizardComponent],
  template: \`<app-checkout-wizard />\`
})
export class CheckoutPage {}
\`\`\`
`,
    previewConfig: {
      type: 'form',
      title: 'Checkout Wizard Preview',
      features: ['Signal stepper', 'Reactive validation', 'Review step'],
    },
  },

  // 3. JSON-Schema Dynamic Form
  {
    id: 'sample-dynamic-form',
    type: 'Dynamic Form',
    prompt: 'Build a dynamic form engine driven by a typed JSON schema supporting text, select, checkbox, conditional visibility, and custom validation',
    timestamp: Date.now() - 3600000 * 3,
    title: 'JSON-Schema Dynamic Form Generator',
    description: 'Declarative schema-driven form engine with Signal inputs, dynamic FormControl generation, conditional visibility bindings, and reactive JSON outputs.',
    fileName: 'dynamic-form.component',
    componentName: 'DynamicFormComponent',
    tags: ['DynamicForms', 'JSONSchema', 'Signals', 'ConditionalLogic', 'Extensible'],
    ts: `import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DynamicFieldSchema {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  readonly schema = input.required<DynamicFieldSchema[]>();
  readonly formSubmitted = output<Record<string, any>>();
  readonly form = signal<FormGroup>(new FormGroup({}));

  onSubmit(): void {
    const active = this.form();
    if (active.valid) {
      this.formSubmitted.emit(active.getRawValue());
    }
  }
}
`,
    html: `<form [formGroup]="form()" (ngSubmit)="onSubmit()">
  @for (field of schema(); track field.name) {
    <div class="field">
      <label>{{ field.label }}</label>
      <input [formControlName]="field.name" />
    </div>
  }
  <button type="submit">Submit Dynamic Form</button>
</form>
`,
    scss: `.field { margin-bottom: 1rem; }`,
    spec: `import { TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {
  it('should initialize', () => {
    const fixture = TestBed.createComponent(DynamicFormComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
`,
    usage: `### Usage
\`\`\`html
<app-dynamic-form [schema]="schema" (formSubmitted)="onSave($event)" />
\`\`\`
`,
    previewConfig: {
      type: 'dynamic-form',
      title: 'Dynamic Form Live Engine',
      features: ['Typed JSON schema', 'Conditional visibility', 'Instant validation'],
      schema: [
        { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. Evelyn Reed', required: true },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'evelyn@bio.tech', required: true },
        {
          name: 'role',
          label: 'Account Role',
          type: 'select',
          defaultValue: 'developer',
          options: [
            { label: 'Developer', value: 'developer' },
            { label: 'Enterprise Admin', value: 'admin' },
            { label: 'Auditor', value: 'auditor' },
          ],
        },
        {
          name: 'securityToken',
          label: 'Enterprise Security Key',
          type: 'text',
          hint: 'Required only for Enterprise Admin tier',
          visibleIf: { field: 'role', equals: 'admin' },
        },
        { name: 'newsletter', label: 'Receive Angular Monthly updates', type: 'checkbox', defaultValue: true },
      ],
    },
  },

  // 4. User API Service with Caching and Retry
  {
    id: 'sample-user-service',
    type: 'Service',
    prompt: 'Generate an Angular service that fetches users with in-memory caching, retry backoff, RxJS shareReplay, signal state, and clean error handling',
    timestamp: Date.now() - 3600000 * 2,
    title: 'Enterprise User API Service',
    description: 'Zoneless-ready singleton service utilizing inject(HttpClient), signal-backed state caching, exponential retry backoff, and shareReplay optimization.',
    fileName: 'user.service',
    componentName: 'UserService',
    tags: ['Service', 'RxJS', 'HttpClient', 'Caching', 'Signals', 'Retry'],
    ts: `import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, shareReplay, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private usersCache$?: Observable<User[]>;

  private readonly usersState = signal<User[]>([]);
  readonly users = computed(() => this.usersState());

  getUsers(force = false): Observable<User[]> {
    if (force || !this.usersCache$) {
      this.usersCache$ = this.http.get<User[]>('/api/v1/users').pipe(
        retry(2),
        tap(users => this.usersState.set(users)),
        shareReplay(1)
      );
    }
    return this.usersCache$;
  }
}
`,
    html: `<!-- Services do not have HTML templates -->`,
    scss: `/* Services do not have SCSS files */`,
    spec: `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UserService);
  });
  it('should be created', () => expect(service).toBeTruthy());
});
`,
    usage: `### Inject UserService
\`\`\`typescript
@Component({ standalone: true, template: \`...\` })
export class UserList {
  userService = inject(UserService);
}
\`\`\`
`,
    previewConfig: {
      type: 'service-tester',
      title: 'UserService Live Test Harness',
      features: ['In-memory caching', 'Retry backoff', 'Signal reactivity'],
    },
  },

  // 5. Data Table Component
  {
    id: 'sample-data-table',
    type: 'Component',
    prompt: 'Create a responsive Angular data table with signal-based sorting, pagination, search filtering, column selection, and @defer loading',
    timestamp: Date.now() - 3600000 * 1,
    title: 'Reactive Signals Data Table',
    description: 'High-performance standalone data table with signal-driven sorting, instant debounced filtering, pagination, and accessibility ARIA table roles.',
    fileName: 'data-table.component',
    componentName: 'DataTableComponent',
    tags: ['Signals', 'DataTable', 'OnPush', 'Accessibility', 'Control Flow'],
    ts: `import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any>> {
  readonly data = input.required<T[]>();
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);

  readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.data().filter(item =>
      Object.values(item).some(v => String(v).toLowerCase().includes(q))
    );
  });
}
`,
    html: `<div class="table-container">
  @for (row of filtered(); track $index) {
    <div class="row">{{ row | json }}</div>
  }
</div>
`,
    scss: `.table-container { width: 100%; }`,
    spec: `import { TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';

describe('DataTableComponent', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(DataTableComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
`,
    usage: `### Usage
\`\`\`html
<app-data-table [data]="items" />
\`\`\`
`,
    previewConfig: {
      type: 'component',
      title: 'Data Table Live Demo',
      features: ['Signal sorting', 'Pagination', 'Instant search'],
    },
  },

  // 6. Debounce Search Directive
  {
    id: 'sample-debounce-directive',
    type: 'Directive',
    prompt: 'Build an Angular directive that debounces text input events with RxJS takeUntilDestroyed, customizable delay, and signal output',
    timestamp: Date.now() - 3600000 * 0.5,
    title: 'Debounce Search Input Directive',
    description: 'Standalone directive that listens to native input events, pipes through RxJS debounceTime and distinctUntilChanged, and outputs debounced values.',
    fileName: 'debounce-search.directive',
    componentName: 'DebounceSearchDirective',
    tags: ['Directive', 'RxJS', 'takeUntilDestroyed', 'Debounce', 'Performance'],
    ts: `import {
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[appDebounceSearch]',
  standalone: true,
})
export class DebounceSearchDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly destroyRef = inject(DestroyRef);

  readonly delay = input<number>(300);
  readonly debounced = output<string>();

  ngOnInit(): void {
    fromEvent<InputEvent>(this.el.nativeElement, 'input').pipe(
      map(e => (e.target as HTMLInputElement).value),
      debounceTime(this.delay()),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => this.debounced.emit(val));
  }
}
`,
    html: `<!-- Directives attach to input elements:
<input type="text" appDebounceSearch (debounced)="onSearch($event)" />
-->
`,
    scss: `/* Directives do not require SCSS */`,
    spec: `import { TestBed } from '@angular/core/testing';
import { DebounceSearchDirective } from './debounce-search.directive';

describe('DebounceSearchDirective', () => {
  it('should compile', () => expect(DebounceSearchDirective).toBeTruthy());
});
`,
    usage: `### Usage
\`\`\`html
<input appDebounceSearch [delay]="400" (debounced)="onSearch($event)" />
\`\`\`
`,
    previewConfig: {
      type: 'directive-tester',
      title: 'Debounce Directive Interactive Tester',
      features: ['Keystroke throttle visualizer', 'Custom delay slider', 'Network call counter'],
    },
  },
];
