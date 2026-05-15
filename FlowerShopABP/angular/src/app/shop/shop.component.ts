import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  danhSachSanPham: any[] = [];
  danhSachHienThi: any[] = [];

  tuKhoa: string = '';
  dangTai: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.layDanhSachSanPham();
  }

  layDanhSachSanPham() {
    this.dangTai = true;

    const apiUrl = environment.fshopApiUrl + '/api/SanPham';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachSanPham = data || [];
        this.danhSachHienThi = this.danhSachSanPham;
        this.dangTai = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
        this.danhSachSanPham = [];
        this.danhSachHienThi = [];
        this.dangTai = false;
        this.cdr.detectChanges();
      }
    });
  }

  timKiemSanPham() {
    const keyword = this.tuKhoa.trim().toLowerCase();

    if (!keyword) {
      this.danhSachHienThi = this.danhSachSanPham;
      return;
    }

    this.danhSachHienThi = this.danhSachSanPham.filter(sp => {
      const maSP = this.layMaSP(sp).toLowerCase();
      const tenSP = this.layTenSP(sp).toLowerCase();

      return maSP.includes(keyword) || tenSP.includes(keyword);
    });
  }

  layMaSP(sp: any): string {
    return sp.maSP || sp.maSp || '';
  }

  layTenSP(sp: any): string {
    return sp.tenSP || sp.tenSp || '';
  }

  layDonGia(sp: any): number {
    return sp.donGia || 0;
  }

  laySoLuongTon(sp: any): number {
    return sp.soLuongTon || 0;
  }

  layMaDM(sp: any): string {
    return sp.maDM || sp.maDm || '';
  }

  layAnhSanPham(sp: any): string {
    const maSP = this.layMaSP(sp);

    if (!maSP) {
      return 'assets/img/hoa.jpg';
    }

    return `assets/img/${maSP}.jpg`;
  }

  xuLyLoiAnh(event: any) {
    event.target.src = 'assets/img/hoa.jpg';
  }
}