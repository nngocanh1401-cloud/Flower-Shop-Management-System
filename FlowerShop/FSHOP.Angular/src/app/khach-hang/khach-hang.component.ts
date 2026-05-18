import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../environments/environment';

export interface KhachHang {
  maKH?: string;
  maKh?: string;
  maKhachHang?: string;
  tenKH?: string;
  tenKh?: string;
  tenKhachHang?: string;
  sdt?: string;
  diaChi?: string;
}

export interface GoiYKhachHang {
  label: string;
  value: string;
  khachHang: KhachHang;
}

@Component({
  selector: 'app-khach-hang',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './khach-hang.component.html',
  styleUrl: './khach-hang.component.css'
})
export class KhachHangComponent implements OnInit {
  danhSachKhachHang: KhachHang[] = [];
  danhSachKhachHangGoc: KhachHang[] = [];

  danhSachGoiYKhachHang: GoiYKhachHang[] = [];
  goiYKhachHang: GoiYKhachHang[] = [];
  khachHangTimThay: KhachHang | null = null;

  sdtTimKiem: string = '';

  dangTaiDanhSach: boolean = false;
  dangTimKiem: boolean = false;
  daTimKiem: boolean = false;

  hienThiDialogThem: boolean = false;

  khachHangMoi: any = {
    tenKH: '',
    sdt: '',
    diaChi: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.layDanhSachKhachHang();

    this.route.queryParams.subscribe(params => {
      const moThemKhach = params['moThemKhach'] === 'true';
      const sdt = params['sdt'] || '';

      if (moThemKhach) {
        setTimeout(() => {
          this.moDialogThemKhachHang(sdt);

          this.router.navigate(['/app/khach-hang'], {
            replaceUrl: true
          });
        }, 300);
      }
    });
  }

  // LẤY DANH SÁCH KHÁCH HÀNG
  layDanhSachKhachHang() {
    this.dangTaiDanhSach = true;

    const apiUrl = environment.fshopApiUrl + '/api/KhachHang';

    this.http.get<KhachHang[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachKhachHangGoc = data || [];
        this.danhSachKhachHang = [...this.danhSachKhachHangGoc];

        this.capNhatDanhSachGoiYSdt();

        this.dangTaiDanhSach = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải danh sách khách hàng:', err);

        this.danhSachKhachHang = [];
        this.dangTaiDanhSach = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách khách hàng'
        });

        this.cdr.detectChanges();
      }
    });
  }

  timKiemKhachHangTuDong() {
    const tuKhoa = this.chuanHoaTimKiemKhachHang(this.sdtTimKiem);

    this.khachHangTimThay = null;
    this.dangTimKiem = false;

    if (!tuKhoa) {
      this.danhSachKhachHang = [...this.danhSachKhachHangGoc];
      this.daTimKiem = false;
      this.cdr.detectChanges();
      return;
    }

    this.daTimKiem = true;

    this.danhSachKhachHang = this.danhSachKhachHangGoc.filter((kh: any) => {
      const noiDungCanTim = [
        this.layMaKhachHang(kh),
        this.layTenKhachHang(kh),
        this.laySdt(kh),
        this.layDiaChi(kh)
      ].join(' ');

      return this.chuanHoaTimKiemKhachHang(noiDungCanTim).includes(tuKhoa);
    });

    this.cdr.detectChanges();
  }

  chuanHoaTimKiemKhachHang(value: any): string {
    return (value || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  }

  moDialogThemKhachHangTuTimKiem() {
    const tuKhoa = (this.sdtTimKiem || '').trim();

    const chiLaySdtNeuNguoiDungNhapSo = /^0?\d{1,10}$/.test(tuKhoa)
      ? tuKhoa
      : '';

    this.moDialogThemKhachHang(chiLaySdtNeuNguoiDungNhapSo);
  }

  capNhatDanhSachGoiYSdt() {
    const danhSachGoiY = this.danhSachKhachHang
      .map(kh => {
        const sdt = this.laySdt(kh);
        const ten = this.layTenKhachHang(kh);

        if (!sdt) {
          return null;
        }

        return {
          label: ten ? `${sdt} - ${ten}` : sdt,
          value: sdt,
          khachHang: kh
        } as GoiYKhachHang;
      })
      .filter(x => x !== null) as GoiYKhachHang[];

    const daCoSdt = new Set<string>();

    this.danhSachGoiYKhachHang = danhSachGoiY.filter(item => {
      if (daCoSdt.has(item.value)) {
        return false;
      }

      daCoSdt.add(item.value);
      return true;
    });
  }

  locGoiYKhachHang(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase().trim() : '';

    if (!tuKhoa) {
      this.goiYKhachHang = this.danhSachGoiYKhachHang;
      return;
    }

    this.goiYKhachHang = this.danhSachGoiYKhachHang.filter(item =>
      item.label.toLowerCase().includes(tuKhoa) ||
      item.value.toLowerCase().includes(tuKhoa)
    );
  }

  chonGoiYKhachHang(event: any) {
    const item = event.value as GoiYKhachHang;

    if (!item) {
      return;
    }

    this.sdtTimKiem = item.value;
    this.khachHangTimThay = item.khachHang;
    this.daTimKiem = true;
    this.dangTimKiem = false;

    this.cdr.detectChanges();
  }

  // TÌM KHÁCH HÀNG THEO SĐT
  timKhachHangTheoSdt(hienThongBao: boolean = true) {
    const sdt = typeof this.sdtTimKiem === 'string'
      ? this.sdtTimKiem.trim()
      : (this.sdtTimKiem as any)?.value?.trim();

    if (!sdt) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập số điện thoại cần tìm'
      });
      return;
    }

    const regexSdt = /^0\d{9}$/;

    if (!regexSdt.test(sdt)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Số điện thoại không hợp lệ',
        detail: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0'
      });
      return;
    }

    this.dangTimKiem = true;
    this.daTimKiem = true;
    this.khachHangTimThay = null;

    const apiUrl = environment.fshopApiUrl + '/api/KhachHang/tim-sdt';
    const params = new HttpParams().set('sdt', sdt);

    this.http.get<KhachHang>(apiUrl, { params }).subscribe({
      next: (data) => {
        this.dangTimKiem = false;
        this.khachHangTimThay = data;

        if (hienThongBao) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã tìm thấy khách hàng'
          });
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tìm khách hàng:', err);

        this.dangTimKiem = false;
        this.khachHangTimThay = null;

        if (hienThongBao) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Không tìm thấy',
            detail: 'Không tìm thấy khách hàng với số điện thoại này'
          });
        }

        this.cdr.detectChanges();
      }
    });
  }

  // THÊM KHÁCH HÀNG MỚI
  moDialogThemKhachHang(sdtMacDinh: string = '') {
    this.khachHangMoi = {
      tenKH: '',
      sdt: sdtMacDinh || this.sdtTimKiem || '',
      diaChi: ''
    };

    this.hienThiDialogThem = true;
    this.cdr.detectChanges();
  }

  themKhachHang() {
    const tenKH = this.khachHangMoi.tenKH?.trim();
    const sdt = this.khachHangMoi.sdt?.trim();
    const diaChi = this.khachHangMoi.diaChi?.trim();

    if (!tenKH || !sdt) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập tên khách hàng và số điện thoại'
      });
      return;
    }

    const regexSdt = /^0\d{9}$/;

    if (!regexSdt.test(sdt)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Số điện thoại không hợp lệ',
        detail: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/KhachHang/admin';

    const body = {
      tenKH: tenKH,
      sdt: sdt,
      diaChi: diaChi || null
    };

    this.http.post<any>(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã thêm khách hàng mới'
        });

        this.hienThiDialogThem = false;
        this.sdtTimKiem = sdt;

        this.layDanhSachKhachHang();
        this.timKhachHangTheoSdt(false);
      },
      error: (err) => {
        console.error('Lỗi thêm khách hàng:', err);

        let noiDungLoi = 'Không thể thêm khách hàng';

        if (typeof err.error === 'string') {
          noiDungLoi = err.error;
        } else if (err.error?.message) {
          noiDungLoi = err.error.message;
        } else if (err.status === 401) {
          noiDungLoi = 'Bạn cần đăng nhập trước khi thêm khách hàng';
        } else if (err.status === 403) {
          noiDungLoi = 'Tài khoản hiện tại không có quyền thêm khách hàng';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: noiDungLoi
        });
      }
    });
  }

  // LÀM MỚI
  lamMoi() {
    this.sdtTimKiem = '';
    this.khachHangTimThay = null;
    this.daTimKiem = false;
    this.dangTimKiem = false;

    if (this.danhSachKhachHangGoc.length > 0) {
      this.danhSachKhachHang = [...this.danhSachKhachHangGoc];
      this.cdr.detectChanges();
      return;
    }

    this.layDanhSachKhachHang();
  }

  // HÀM PHỤ ĐỂ TRÁNH LỆCH TÊN FIELD
  layMaKhachHang(kh: any): string {
    return kh?.maKH || kh?.maKh || kh?.maKhachHang || kh?.maKHachHang || '';
  }

  layTenKhachHang(kh: any): string {
    return kh?.tenKH || kh?.tenKh || kh?.tenKhachHang || '';
  }

  laySdt(kh: any): string {
    return kh?.sdt || kh?.soDienThoai || '';
  }

  layDiaChi(kh: any): string {
    return kh?.diaChi || '';
  }

  // TẠO ĐƠN HÀNG CHO KHÁCH HÀNG DỰA TRÊN SỐ ĐIỆN THOẠI
  taoDonHangChoKhachHang(kh: any) {
    const maKH = this.layMaKhachHang(kh);
    const tenKH = this.layTenKhachHang(kh);
    const sdt = this.laySdt(kh);
    const diaChi = this.layDiaChi(kh);

    if (!maKH) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã khách hàng',
        detail: 'Không thể tạo đơn vì khách hàng chưa có mã KH'
      });
      return;
    }

    const url =
      `/app/don-hang?moTaoDon=true` +
      `&maKH=${encodeURIComponent(maKH)}` +
      `&tenKH=${encodeURIComponent(tenKH || '')}` +
      `&sdt=${encodeURIComponent(sdt || '')}` +
      `&diaChi=${encodeURIComponent(diaChi || '')}`;

    window.location.href = url;
  }
}