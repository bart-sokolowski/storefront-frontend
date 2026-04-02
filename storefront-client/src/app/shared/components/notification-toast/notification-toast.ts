import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-notification-toast',
  imports: [AsyncPipe],
  templateUrl: './notification-toast.html',
  styleUrl: './notification-toast.scss'
})
export class NotificationToast {
  protected readonly notificationService = inject(NotificationService);
  protected readonly notifications$ = this.notificationService.notifications;

  dismiss(notification: AppNotification): void {
    this.notificationService.dismiss(notification.id);
  }
}
