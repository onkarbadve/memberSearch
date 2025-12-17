import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           class="toast" 
           [ngClass]="'toast-' + toast.type">
        <div class="toast-content">
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      min-width: 300px;
      max-width: 400px;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      animation: slideIn 0.3s ease-out;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    @keyframes slideIn {
      from {
        transform: translateX(450px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toast-icon {
      font-size: 24px;
      font-weight: bold;
      flex-shrink: 0;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .toast-message {
      flex: 1;
      color: white;
      font-weight: 600;
      font-size: 15px;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .toast-success {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .toast-error {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .toast-info {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .toast-warning {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        this.removeToast(toast);
      }, toast.duration || 3000);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  removeToast(toast: Toast) {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      case 'warning': return '⚠';
      default: return '';
    }
  }
}
