import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, LoadingButton, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.products.set(result.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected addToCart(product: Product): void {
    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: 1
    });
    this.notificationService.add(`${product.name} added to cart.`, 'info');
  }

  protected get cartCount(): number {
    return this.cartService.itemCount;
  }
}
