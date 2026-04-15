import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3">
      <div *ngFor="let toast of toasts$ | async"
           class="px-6 py-4 rounded-xl shadow-2xl text-white font-medium flex items-center space-x-3 transform transition-all duration-300 animate-slide-up"
           [ngClass]="{
             'bg-emerald-600 shadow-emerald-600/30': toast.type === 'success',
             'bg-red-600 shadow-red-600/30': toast.type === 'error',
             'bg-blue-600 shadow-blue-600/30': toast.type === 'info'
           }">

        <svg *ngIf="toast.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <svg *ngIf="toast.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

        <span>{{ toast.message }}</span>

        <button (click)="fechar(toast.id)" class="ml-4 opacity-70 hover:opacity-100 transition">✕</button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
  `]
})
export class ToastComponent {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  fechar(id: number) {
    this.toastService.remove(id);
  }
}
