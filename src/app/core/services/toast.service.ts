import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/angular.models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  show(message: string, type: ToastMessage['type'] = 'success'): void {
    const toast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      message,
      type,
    };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), 3500);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
