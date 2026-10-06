import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { GeneratedOutput, DynamicFormField } from '../../../../core/models/angular.models';
import { ToastService } from '../../../../core/services/toast.service';
import { GeneratorService } from '../../generator.service';

@Component({
  selector: 'app-live-preview',
  imports: [FormsModule, JsonPipe],
  templateUrl: './live-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivePreviewComponent {
  private readonly toast = inject(ToastService);
  readonly generator = inject(GeneratorService);
  readonly output = input.required<GeneratedOutput>();

  readonly activeTab = signal<'ui' | 'signals' | 'schema'>('ui');
  readonly submitSuccess = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly emittedEvents = signal<Array<{ name: string; payload: any; time: string }>>([]);

  // Login Form State (preview sandbox only — simulates a generated form's runtime behavior)
  email = '';
  password = signal('');
  showPassword = signal(false);
  rememberMe = false;
  formTouched = signal(false);

  readonly isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email));
  readonly isPasswordValid = computed(() => this.password().length >= 8);

  readonly passwordStrength = computed(() => {
    const pwd = this.password();
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  });

  readonly strengthText = computed(() => {
    switch (this.passwordStrength()) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'Too short';
    }
  });

  // Wizard state
  readonly wizardStep = signal<'shipping' | 'billing' | 'review'>('shipping');
  shippingFullName = 'Sarah Connor';
  shippingAddress = '742 Evergreen Terrace';
  billingCardName = 'Sarah Connor';
  billingCardNumber = '4532 •••• •••• 8901';

  // Dynamic Form state
  dynFullName = 'Dr. Evelyn Reed';
  dynRole = 'developer';
  dynSecurityToken = '';

  readonly defaultSchema: DynamicFormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    {
      name: 'role',
      label: 'Account Role',
      type: 'select',
      defaultValue: 'developer',
      options: [{ label: 'Developer', value: 'developer' }, { label: 'Admin', value: 'admin' }],
    },
    {
      name: 'securityToken',
      label: 'Security Token',
      type: 'text',
      visibleIf: { field: 'role', equals: 'admin' },
    },
  ];

  readonly isLoginForm = computed(() => {
    const o = this.output();
    return o.fileName.includes('login') || o.title.toLowerCase().includes('login');
  });

  readonly isCheckout = computed(() => {
    const o = this.output();
    return o.fileName.includes('checkout') || o.title.toLowerCase().includes('checkout');
  });

  readonly isDynamicForm = computed(() => {
    return this.output().type === 'Dynamic Form' || this.output().fileName.includes('dynamic');
  });

  handleLoginSubmit(): void {
    this.formTouched.set(true);
    if (!this.isEmailValid() || !this.isPasswordValid()) return;

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(`Authenticated successfully as ${this.email}`);
      this.emittedEvents.update(list => [
        {
          name: 'submitLogin.emit()',
          payload: { email: this.email, rememberMe: this.rememberMe },
          time: new Date().toLocaleTimeString(),
        },
        ...list,
      ]);
      setTimeout(() => this.submitSuccess.set(null), 3000);
    }, 500);
  }

  forgotPassword(): void {
    this.toast.show('Emitted forgotPassword.emit() output signal', 'info');
  }

  completeOrder(): void {
    this.submitSuccess.set('Order completed successfully! Emitted orderCompleted.emit()');
    this.emittedEvents.update(list => [
      {
        name: 'orderCompleted.emit()',
        payload: { name: this.shippingFullName, total: '$149.00' },
        time: new Date().toLocaleTimeString(),
      },
      ...list,
    ]);
    setTimeout(() => this.submitSuccess.set(null), 3000);
  }

  handleDynamicSubmit(): void {
    this.submitSuccess.set('Dynamic form values emitted to parent!');
    this.emittedEvents.update(list => [
      {
        name: 'formSubmitted.emit()',
        payload: { name: this.dynFullName, role: this.dynRole, token: this.dynSecurityToken },
        time: new Date().toLocaleTimeString(),
      },
      ...list,
    ]);
    setTimeout(() => this.submitSuccess.set(null), 3000);
  }

  triggerGenericAction(): void {
    this.submitSuccess.set('Action executed! Signal emitted.');
    this.emittedEvents.update(list => [
      {
        name: 'actionSubmitted.emit()',
        payload: { time: Date.now() },
        time: new Date().toLocaleTimeString(),
      },
      ...list,
    ]);
    setTimeout(() => this.submitSuccess.set(null), 3000);
  }
}
