// lib/toast.ts
// Global Toast notification event store

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

type Listener = (toasts: ToastMessage[]) => void;

class ToastStore {
  private toasts: ToastMessage[] = [];
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  notify() {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 4000;
    const newToast: ToastMessage = { ...toast, id };
    this.toasts.push(newToast);
    this.notify();

    setTimeout(() => {
      this.dismiss(id);
    }, duration);

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(title: string, message?: string) {
    return this.show({ type: 'success', title, message });
  }

  error(title: string, message?: string) {
    return this.show({ type: 'error', title, message });
  }

  info(title: string, message?: string) {
    return this.show({ type: 'info', title, message });
  }

  warning(title: string, message?: string) {
    return this.show({ type: 'warning', title, message });
  }
}

export const toast = new ToastStore();
