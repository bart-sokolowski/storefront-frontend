import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { UserContextService } from '../../../core/services/user-context.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly userContextService = inject(UserContextService);

  protected readonly orders = signal<Order[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isAdmin = this.userContextService.getContext()?.isAdmin ?? false;

  ngOnInit(): void {
    this.orderService.getAll().subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.orders.set(result.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected statusClass(paymentStatus: string): string {
    const map: Record<string, string> = {
      Confirmed: 'status--confirmed',
      Failed: 'status--failed',
      Pending: 'status--pending',
      Processing: 'status--pending'
    };
    return map[paymentStatus] ?? '';
  }
}
