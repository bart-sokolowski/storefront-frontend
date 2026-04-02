import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CartItem } from '../../../core/models/cart.model';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-order-create',
  imports: [RouterLink, LoadingButton, DecimalPipe],
  templateUrl: './order-create.html',
  styleUrl: './order-create.scss'
})
export class OrderCreate implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly cartItems = signal<CartItem[]>([]);
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.cartService.items.subscribe(items => {
      this.cartItems.set(items);
    });
  }

  protected get total(): number {
    return this.cartService.getTotal();
  }

  protected updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  protected removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  protected placeOrder(): void {
    if (this.cartItems().length === 0 || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const request = {
      items: this.cartItems().map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.orderService.create(request).subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.cartService.clear();
          this.notificationService.add(
            result.note ?? 'Order placed. Awaiting payment confirmation.',
            'info',
            result.data.id
          );
          this.router.navigate(['/orders', result.data.id]);
        } else {
          this.notificationService.add(result.note ?? 'Failed to place order.', 'error');
          this.isSubmitting.set(false);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}
