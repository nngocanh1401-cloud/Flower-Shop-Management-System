import { Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, NavigationEnd, PRIMARY_OUTLET, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from '@shared/layout/menu-item';
import { NgTemplateOutlet } from '@angular/common';
import { CollapseDirective } from 'ngx-bootstrap/collapse';

@Component({
    selector: 'sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    standalone: true,
    imports: [NgTemplateOutlet, RouterLink, CollapseDirective],
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
    menuItems!: MenuItem[];
    menuItemsMap: { [key: number]: MenuItem } = {};
    activatedMenuItems: MenuItem[] = [];
    routerEvents = new BehaviorSubject<any>(undefined);
    homeRoute = '/app/about';

    constructor(
        injector: Injector,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.menuItems = this.getMenuItems();
        this.patchMenuItems(this.menuItems);

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const currentUrl = event.urlAfterRedirects
                    ? event.urlAfterRedirects.split('?')[0]
                    : event.url.split('?')[0];

                this.activateMenuItems(currentUrl);
                this.cdr.detectChanges();
            });

        // Quan trọng: active menu ngay khi F5/reload trang
        const currentUrl = this.router.url.split('?')[0];
        this.activateMenuItems(currentUrl);

        this.cdr.detectChanges();
    }

    getMenuItems(): MenuItem[] {
        return [
            new MenuItem('Sản Phẩm', '/app/san-pham', 'fas fa-seedling'),
            new MenuItem('Đơn Hàng', '/app/don-hang', 'fas fa-shopping-cart'),
            new MenuItem('Khách Hàng', '/app/khach-hang', 'fas fa-users'),
            new MenuItem('Kho Hàng', '/app/kho', 'fas fa-warehouse'),
            new MenuItem('Báo cáo', '/app/bao-cao', 'fas fa-chart-line'),
            new MenuItem(this.l('About'), '/app/about', 'fas fa-info-circle'),
            new MenuItem(this.l('HomePage'), '/app/home', 'fas fa-home'),
            new MenuItem(this.l('Roles'), '/app/roles', 'fas fa-theater-masks', 'Pages.Roles'),
            new MenuItem(this.l('Tenants'), '/app/tenants', 'fas fa-building', 'Pages.Tenants'),
            new MenuItem(this.l('Users'), '/app/users', 'fas fa-users', 'Pages.Users'),
            new MenuItem(this.l('MultiLevelMenu'), '', 'fas fa-circle', '', [
                new MenuItem('ASP.NET Boilerplate', '', 'fas fa-dot-circle', '', [
                    new MenuItem('Home', 'https://aspnetboilerplate.com?ref=abptmpl', 'far fa-circle'),
                    new MenuItem('Templates', 'https://aspnetboilerplate.com/Templates?ref=abptmpl', 'far fa-circle'),
                    new MenuItem('Samples', 'https://aspnetboilerplate.com/Samples?ref=abptmpl', 'far fa-circle'),
                    new MenuItem(
                        'Documents',
                        'https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl',
                        'far fa-circle'
                    ),
                ]),
                new MenuItem('ASP.NET Zero', '', 'fas fa-dot-circle', '', [
                    new MenuItem('Home', 'https://aspnetzero.com?ref=abptmpl', 'far fa-circle'),
                    new MenuItem('Features', 'https://aspnetzero.com/Features?ref=abptmpl', 'far fa-circle'),
                    new MenuItem('Pricing', 'https://aspnetzero.com/Pricing?ref=abptmpl#pricing', 'far fa-circle'),
                    new MenuItem('Faq', 'https://aspnetzero.com/Faq?ref=abptmpl', 'far fa-circle'),
                    new MenuItem('Documents', 'https://aspnetzero.com/Documents?ref=abptmpl', 'far fa-circle'),
                ]),
            ]),
        ];
    }

    patchMenuItems(items: MenuItem[], parentId?: number): void {
        items.forEach((item: MenuItem, index: number) => {
            item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
            if (parentId) {
                item.parentId = parentId;
            }
            if (parentId || item.children) {
                this.menuItemsMap[item.id] = item;
            }
            if (item.children) {
                this.patchMenuItems(item.children, item.id);
            }
        });
    }

    activateMenuItems(url: string): void {
        this.activatedMenuItems = [];

        this.deactivateMenuItems(this.menuItems);

        const foundedMenuItems = this.findMenuItemsByUrl(url, this.menuItems);

        foundedMenuItems.forEach((item: MenuItem) => {
            this.activateMenuItem(item);
        });

        this.cdr.detectChanges();
    }

    deactivateMenuItems(items: MenuItem[]): void {
        items.forEach((item: MenuItem) => {
            item.isActive = false;
            item.isCollapsed = true;
            if (item.children) {
                this.deactivateMenuItems(item.children);
            }
        });
    }

    findMenuItemsByUrl(url: string, items: MenuItem[], foundedItems: MenuItem[] = []): MenuItem[] {
        items.forEach((item: MenuItem) => {
            if (item.route === url) {
                foundedItems.push(item);
            } else if (item.children) {
                this.findMenuItemsByUrl(url, item.children, foundedItems);
            }
        });
        return foundedItems;
    }

    activateMenuItem(item: MenuItem): void {
        item.isActive = true;
        if (item.children) {
            item.isCollapsed = false;
        }
        this.activatedMenuItems.push(item);
        if (item.parentId) {
            this.activateMenuItem(this.menuItemsMap[item.parentId]);
        }
    }

    isMenuItemVisible(item: MenuItem): boolean {
        return true;
    }

}
