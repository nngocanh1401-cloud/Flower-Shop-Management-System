import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-shop',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
    danhSachSanPham: any[] = [];
    danhSachHienThi: any[] = [];
    tuKhoa = '';
    dangTai = false;

    private apiUrl = 'https://localhost:7066/api/SanPham';

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private zone: NgZone
    ) {}

    ngOnInit(): void {
        console.log('SHOP COMPONENT ĐÃ CHẠY');
        this.loadSanPham();
    }

    loadSanPham(): void {
        console.log('BẮT ĐẦU GỌI API SẢN PHẨM');
        this.dangTai = true;

        this.http.get<any[]>(this.apiUrl).subscribe({
            next: (res) => {
                console.log('DỮ LIỆU API:', res);

                this.zone.run(() => {
                    this.danhSachSanPham = [...res];
                    this.danhSachHienThi = [...res];
                    this.dangTai = false;

                    console.log('SỐ SP HIỂN THỊ:', this.danhSachHienThi.length);

                    this.cdr.detectChanges();
                });
            },
            error: (err) => {
                console.error('LỖI API:', err);

                this.zone.run(() => {
                    this.dangTai = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    timKiemSanPham(): void {
        const keyword = this.tuKhoa.trim().toLowerCase();

        if (!keyword) {
            this.danhSachHienThi = [...this.danhSachSanPham];
            return;
        }

        this.danhSachHienThi = this.danhSachSanPham.filter(sp =>
            this.layTenSP(sp).toLowerCase().includes(keyword) ||
            this.layMaSP(sp).toLowerCase().includes(keyword)
        );
    }

    layMaSP(sp: any): string {
        return sp?.maSp || sp?.maSP || sp?.MaSp || '';
    }

    layTenSP(sp: any): string {
        return sp?.tenSp || sp?.tenSP || sp?.TenSp || 'Sản phẩm';
    }

    layDonGia(sp: any): number {
        return sp?.donGia || sp?.DonGia || 0;
    }

    laySoLuongTon(sp: any): number {
        return sp?.soLuongTon || sp?.SoLuongTon || 0;
    }

    layAnhSanPham(sp: any): string {
        const maSp = this.layMaSP(sp);
        return sp?.hinhAnh || sp?.HinhAnh || `assets/img/products/${maSp}.jpg`;
    }

    xuLyLoiAnh(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'assets/images/products/default.jpg';
    }
}