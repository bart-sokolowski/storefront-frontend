import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList),
    canActivate: [authGuard]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./features/products/product-admin/product-admin').then(m => m.ProductAdmin),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderList),
    canActivate: [authGuard]
  },
  {
    path: 'orders/create',
    loadComponent: () => import('./features/orders/order-create/order-create').then(m => m.OrderCreate),
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/order-detail/order-detail').then(m => m.OrderDetail),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'products' }
];
