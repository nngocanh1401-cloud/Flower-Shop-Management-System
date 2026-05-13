import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // 1. Nhóm trang ai cũng vào được (Public)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) 
  },
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) 
  },
  { 
    path: 'san-pham', 
    loadComponent: () => import('./pages/product-list/product-list').then(m => m.ProductListComponent) 
  },

  // 2. Nhóm trang cần đăng nhập (Customer)
  { 
    path: 'gio-hang', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent) 
  },
  { 
    path: 'don-hang', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-history/order-history').then(m => m.OrderHistoryComponent) 
  },

  // 3. Nhóm trang Admin (Cần đăng nhập & Quyền Admin)
  { 
    path: 'admin', 
    canActivate: [authGuard, adminGuard],
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) 
      },
      // Nếu có thêm các trang quản lý con, bạn thêm vào đây
    ] 
  },

  // 4. Trang lỗi hoặc chuyển hướng mặc định
  { path: '**', redirectTo: '' }
];