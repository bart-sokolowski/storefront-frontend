import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppNotification, NotificationType } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifications$ = new BehaviorSubject<AppNotification[]>([]);

  readonly notifications = this.notifications$.asObservable();

  add(message: string, type: NotificationType, orderId?: string): void {
    const notification: AppNotification = {
      id: crypto.randomUUID(),
      message,
      type,
      orderId
    };

    this.notifications$.next([...this.notifications$.getValue(), notification]);

    if (type !== 'error') {
      setTimeout(() => this.dismiss(notification.id), 5000);
    }
  }

  dismiss(id: string): void {
    this.notifications$.next(this.notifications$.getValue().filter(n => n.id !== id));
  }
}
