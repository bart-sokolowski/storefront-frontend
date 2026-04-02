import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { LoadingButton } from '../../../shared/components/loading-button/loading-button';

@Component({
  selector: 'app-product-admin',
  imports: [ReactiveFormsModule, RouterLink, LoadingButton, DecimalPipe],
  templateUrl: './product-admin.html',
  styleUrl: './product-admin.scss'
})
export class ProductAdmin implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoadingList = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly deletingIds = signal(new Set<string>());

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.isLoadingList.set(true);
    this.productService.getAll().subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.products.set(result.data);
        }
        this.isLoadingList.set(false);
      },
      error: () => {
        this.isLoadingList.set(false);
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    const { name, description, price, stock } = this.form.value;
    this.isSubmitting.set(true);

    this.productService.create({ name: name!, description: description!, price: price!, stock: stock! }).subscribe({
      next: result => {
        if (result.isSuccess && result.data) {
          this.products.update(list => [result.data!, ...list]);
          this.form.reset();
          this.notificationService.add('Product created successfully.', 'success');
        } else {
          this.notificationService.add(result.note ?? 'Failed to create product.', 'error');
        }
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  protected deleteProduct(product: Product): void {
    if (this.deletingIds().has(product.id)) return;

    this.deletingIds.update(ids => new Set([...ids, product.id]));

    this.productService.delete(product.id).subscribe({
      next: result => {
        if (result.isSuccess) {
          this.products.update(list => list.filter(p => p.id !== product.id));
          this.notificationService.add(`'${product.name}' archived.`, 'success');
        } else {
          this.notificationService.add(result.note ?? 'Failed to archive product.', 'error');
        }
        this.deletingIds.update(ids => {
          const next = new Set(ids);
          next.delete(product.id);
          return next;
        });
      },
      error: () => {
        this.deletingIds.update(ids => {
          const next = new Set(ids);
          next.delete(product.id);
          return next;
        });
      }
    });
  }
}
