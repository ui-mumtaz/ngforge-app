export type GenerationType =
  | 'Component'
  | 'Reactive Form'
  | 'Dynamic Form'
  | 'Service'
  | 'Directive'
  | 'Pipe'
  | 'Guard/Interceptor';

export interface DynamicFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date';
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validators?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  hint?: string;
  visibleIf?: {
    field: string;
    equals: any;
  };
}

export interface PreviewConfig {
  type: 'form' | 'dynamic-form' | 'component' | 'service-tester' | 'directive-tester' | 'pipe-tester';
  title: string;
  description?: string;
  schema?: DynamicFormField[];
  mockData?: any;
  features?: string[];
}

export interface GeneratedOutput {
  id: string;
  type: GenerationType;
  prompt: string;
  timestamp: number;
  title: string;
  description: string;
  fileName: string;
  componentName: string;
  tags: string[];
  ts: string;
  html: string;
  scss: string;
  spec: string;
  usage: string;
  previewConfig?: PreviewConfig;
  isFavorite?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
}
