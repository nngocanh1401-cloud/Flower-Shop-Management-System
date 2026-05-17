import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    { label: 'Sản Phẩm', route: '/app/san-pham', icon: 'fas fa-seedling' },
    { label: 'Đơn Hàng', route: '/app/don-hang', icon: 'fas fa-shopping-cart' },
    { label: 'Khách Hàng', route: '/app/khach-hang', icon: 'fas fa-users' },
    { label: 'Kho Hàng', route: '/app/kho', icon: 'fas fa-warehouse' },
    { label: 'Báo cáo', route: '/app/bao-cao', icon: 'fas fa-chart-line' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.capNhatMenuActive(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.capNhatMenuActive(event.urlAfterRedirects || event.url);
      });
  }

  capNhatMenuActive(url: string) {
    const currentUrl = url.split('?')[0];

    this.menuItems.forEach(item => {
      item.isActive = item.route === currentUrl;
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  dangXuat() {
    this.authService.dangXuat();
    this.router.navigate(['/login']);
  }
}