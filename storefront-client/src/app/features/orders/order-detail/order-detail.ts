import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly order = signal<Order | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Invalid order ID.');
      this.isLoading.set(false);
      return;
    }

    this.orderService.getById(id).subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.order.set(result.data);
        } else {
          this.errorMessage.set(result.note ?? 'Order not found.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected get paymentStatusClass(): string {
    const map: Record<string, string> = {
      Confirmed: 'status--confirmed',
      Failed: 'status--failed',
      Pending: 'status--pending',
      Processing: 'status--pending'
    };
    return map[this.order()?.paymentStatus ?? ''] ?? '';
  }
}
