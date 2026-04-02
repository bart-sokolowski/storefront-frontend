import { Injectable, inject, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SignalrService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private connection: signalR.HubConnection | null = null;

  async connect(): Promise<void> {
    const token = this.authService.getToken();
    if (!token || this.connection?.state === signalR.HubConnectionState.Connected) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    this.connection.on('PaymentStatusUpdated', (payload: { orderId: string; paymentStatus: string; note: string }) => {
      const type = payload.paymentStatus === 'Confirmed' ? 'success' : 'error';
      this.notificationService.add(payload.note, type, payload.orderId);
    });

    try {
      await this.connection.start();
    } catch {
      this.notificationService.add('Failed to connect to real-time notifications.', 'warning');
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
