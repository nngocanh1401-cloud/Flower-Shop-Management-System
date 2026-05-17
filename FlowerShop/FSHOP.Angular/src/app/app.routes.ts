import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

import { SanPhamComponent } from './san-pham/san-pham.component';
import { DonHangComponent } from './don-hang/don-hang.component';
import { KhachHangComponent } from './khach-hang/khach-hang.component';
import { KhoComponent } from './kho/kho.component';
import { BaoCaoComponent } from './bao-cao/bao-cao.component';
import { ShopComponent } from './shop/shop.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'shop',
    component: ShopComponent
  },
  
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'app',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'san-pham',
        pathMatch: 'full'
      },
      {
        path: 'san-pham',
        component: SanPhamComponent
      },
      {
        path: 'don-hang',
        component: DonHangComponent
      },
      {
        path: 'khach-hang',
        component: KhachHangComponent
      },
      {
        path: 'kho',
        component: KhoComponent
      },
      {
        path: 'bao-cao',
        component: BaoCaoComponent
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'shop'
  }
];