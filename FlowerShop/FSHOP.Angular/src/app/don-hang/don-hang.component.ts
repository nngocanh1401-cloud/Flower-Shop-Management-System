import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface DonHang {
  maDH: string;
  maKH?: string;
  tenKhachHang: string;
  maVoucher?: string;
  ngayDat: string | Date;
  tongTien: number;
  tenPTTT: string;
  tenTrangThai: string;
}

@Component({
  selector: 'app-don-hang',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    InputNumberModule,
    AutoCompleteModule,

  ],
  providers: [MessageService],
  templateUrl: './don-hang.component.html',
  styleUrl: './don-hang.component.css'
})

export class DonHangComponent implements OnInit {
  danhSachDonHang: DonHang[] = [];
  danhSachDonHangGoc: DonHang[] = [];

  boLocDonHang: any = {
    maDH: '',
    maKH: '',
    maTrangThai: null,
    maPTTT: null,
    maVoucher: '',
    tuNgay: '',
    denNgay: '',
    keyword: ''
  };

  hienThiHopLoc = false;

  danhSachMaDH: string[] = [];
  danhSachMaKHLoc: string[] = [];
  danhSachMaVoucherLoc: string[] = [];
  danhSachTuKhoaTongHop: string[] = [];

  goiYMaDH: string[] = [];
  goiYMaKH: string[] = [];
  goiYMaVoucher: string[] = [];
  goiYTuKhoaTongHop: string[] = [];

  hienThiDialogChiTiet: boolean = false;
  donHangChiTiet: any = null;
  trangThaiBanDau: number | null = null;

  danhSachTrangThai: any[] = [
    { label: 'Chờ xử lý', value: 1 },
    { label: 'Đang giao', value: 2 },
    { label: 'Hoàn thành', value: 3 },
    { label: 'Đã hủy', value: 4 }
  ];

  danhSachPTTT: any[] = [
    { label: 'Tiền mặt', value: 1 },
    { label: 'Chuyển khoản ngân hàng', value: 2 },
    { label: 'ZaloPay', value: 3 },
    { label: 'Ví MoMo', value: 4 }
  ];

  hienThiDialogTaoDon: boolean = false;
  donHangMoi: any = {
    maDH: '',
    maKH: '',
    maPTTT: 1,
    maVoucher: '',
    danhSachChiTiet: []
  };

  maSpTam: string = '';
  soLuongTam: number = 1;

  danhSachKhachHang: any[] = [];
  danhSachSanPham: any[] = [];
  danhSachVoucher: any[] = [
    { label: '-- Không sử dụng --', value: null }
  ];

  maKHTuKhachHang: string = '';
  tenKHTuKhachHang: string = '';
  sdtTuKhachHang: string = '';
  diaChiTuKhachHang: string = '';
  daMoDialogTuKhachHang: boolean = false;

  sdtTaoDon: any = '';

  danhSachGoiYKhachHangTaoDon: any[] = [];
  goiYKhachHangTaoDon: any[] = [];

  hienThiDialogTaoVoucher: boolean = false;

  voucherMoi: any = {
    maVoucher: '',
    tenVoucher: '',
    ngayBd: '',
    ngayKt: '',
    giaTriGiam: 0,
    loaiGiam: 'PhanTram',
    dieuKienApDung: 0,
    soLuong: 1
  };

  danhSachLoaiGiamVoucher: any[] = [
    { label: 'Giảm theo phần trăm (%)', value: 'PhanTram' },
    { label: 'Giảm theo số tiền (VNĐ)', value: 'TienMat' }
  ];

  readonly GIA_TRI_THEM_VOUCHER = '__THEM_VOUCHER_MOI__';

  constructor(
    private http: HttpClient,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.layDanhSachDonHang();
    this.layDanhSachSanPham();
    this.layDanhSachVoucher();

    this.route.queryParams.subscribe(params => {
      const moTaoDon = params['moTaoDon'] === 'true';

      this.maKHTuKhachHang = params['maKH'] || '';
      this.tenKHTuKhachHang = params['tenKH'] || '';
      this.sdtTuKhachHang = params['sdt'] || '';
      this.diaChiTuKhachHang = params['diaChi'] || '';

      this.layDanhSachKhachHang(() => {
        if (moTaoDon && this.maKHTuKhachHang && !this.daMoDialogTuKhachHang) {
          this.moDialogTaoDon(this.maKHTuKhachHang);
          this.daMoDialogTuKhachHang = true;

          setTimeout(() => {
            this.router.navigate(['/app/don-hang'], { replaceUrl: true });
          }, 300);
        }
      });
    });
  }

  // DANH SÁCH ĐƠN HÀNG
  layDanhSachDonHang() {
    const apiUrl = environment.fshopApiUrl + '/api/DonHang';

    this.http.get<DonHang[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachDonHangGoc = data || [];
        this.danhSachDonHang = [...this.danhSachDonHangGoc];
        this.capNhatDanhSachGoiYTuDonHang(this.danhSachDonHangGoc);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải đơn hàng:', err);
      }
    });
  }

  // CHI TIẾT ĐƠN HÀNG
  xemChiTiet(maDH: string) {
    const apiUrl = environment.fshopApiUrl + `/api/DonHang/${maDH}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.donHangChiTiet = data;
        this.trangThaiBanDau = data.maTrangThai;
        this.hienThiDialogChiTiet = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lấy chi tiết đơn hàng'
        });
      }
    });
  }

  dongDialogChiTiet() {
    this.hienThiDialogChiTiet = false;
    this.donHangChiTiet = null;
  }

  capNhatTrangThai() {
    if (!this.donHangChiTiet) return;

    const maTrangThaiMoi = this.donHangChiTiet.maTrangThai;
    const laHuyDon = maTrangThaiMoi === 4;
    const donHangDangXuLy = { ...this.donHangChiTiet };

    const apiUrl =
      environment.fshopApiUrl +
      `/api/DonHang/${this.donHangChiTiet.maDH}/trangthai?matrangThai=${maTrangThaiMoi}`;

    this.http.put(apiUrl, {}).subscribe({
      next: () => {
        const sauKhiXuLy = () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: laHuyDon ? 'Đã hủy đơn hàng' : 'Đã cập nhật trạng thái đơn hàng'
          });

          this.hienThiDialogChiTiet = false;
          this.donHangChiTiet = null;
          this.layDanhSachDonHang();
        }
      },

      error: (err) => {
        console.error('Lỗi API cập nhật:', err);

        const thongBaoLoi =
          err?.error?.message ||
          err?.error?.title ||
          err?.error ||
          '';
        if (
          laHuyDon &&
          typeof thongBaoLoi === 'string' &&
          thongBaoLoi.toLowerCase().includes('hủy đơn hàng thành công')
        ) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã hủy đơn hàng'
            });

            this.hienThiDialogChiTiet = false;
            this.donHangChiTiet = null;
            this.layDanhSachDonHang();

          return;
        }

        if (this.donHangChiTiet) {
          this.donHangChiTiet.maTrangThai = this.trangThaiBanDau;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: thongBaoLoi || 'Không thể cập nhật trạng thái'
        });

        this.cdr.detectChanges();
      }
    });
  }

 congTonKhoBuSauKhiTaoDon(danhSachChiTiet: any[], callback?: () => void) {
  if (!danhSachChiTiet || danhSachChiTiet.length === 0) {
    if (callback) callback();
    return;
  }

  const danhSachRequest = danhSachChiTiet.map((ct: any) => {
    const maSP = ct.maSp || ct.maSP;
    const soLuong = Number(ct.soLuong || 0);

    if (!maSP || soLuong <= 0) {
      return of(null);
    }

    const apiGet = environment.fshopApiUrl + `/api/SanPham/${maSP}`;

    return this.http.get<any>(apiGet).pipe(
      catchError((err) => {
        console.error('Không lấy được sản phẩm:', maSP, err);
        return of(null);
      })
    );
  });

  forkJoin(danhSachRequest).subscribe({
    next: (dsSanPham) => {
      const danhSachSanPham = dsSanPham as any[];

      const danhSachPut = danhSachSanPham
        .map((sp: any, index: number) => {
          if (!sp) return null;

          const ct = danhSachChiTiet[index];
          const soLuong = Number(ct.soLuong || 0);
          const maSP = sp.maSp || sp.maSP || ct.maSp || ct.maSP;

          const body = {
            tenSP: sp.tenSp || sp.tenSP || '',
            donGia: Number(sp.donGia || 0),
            soLuongTon: Number(sp.soLuongTon || 0) + soLuong,
            maDM: sp.maDm || sp.maDM || ''
          };

          const apiPut = environment.fshopApiUrl + `/api/SanPham/${maSP}`;

          return this.http.put(apiPut, body).pipe(
            catchError((err) => {
              console.error('Không cộng bù tồn kho sau khi tạo đơn:', maSP, err);
              return of(null);
            })
          );
        })
        .filter((x: any) => x !== null);

      if (danhSachPut.length === 0) {
        if (callback) callback();
        return;
      }

      forkJoin(danhSachPut).subscribe({
        next: () => {
          console.log('Đã cộng bù tồn kho sau khi tạo đơn');
          if (callback) callback();
        },
        error: () => {
          if (callback) callback();
        }
      });
    },
    error: () => {
      if (callback) callback();
    }
  });
}

  // TẠO ĐƠN HÀNG
  moDialogTaoDon(maKHMacDinh: string = '') {
    this.donHangMoi = {
      maKH: maKHMacDinh || '',
      maPTTT: 1,
      maVoucher: null,
      danhSachChiTiet: []
    };

    this.sdtTaoDon = '';

    if (maKHMacDinh) {
      const kh = this.danhSachKhachHang.find(
        (x: any) => x.value === maKHMacDinh || x.maKH === maKHMacDinh
      );

      if (kh) {
        this.sdtTaoDon = `${kh.sdt} - ${kh.tenKH}`;
      }
    }

    this.maSpTam = '';
    this.soLuongTam = 1;
    this.hienThiDialogTaoDon = true;
    this.cdr.detectChanges();
  }

  layDanhSachSanPham() {
    this.http.get<any[]>(environment.fshopApiUrl + '/api/SanPham').subscribe({
      next: (data) => {
        this.danhSachSanPham = data.map(sp => ({
          label: `${sp.maSp} - ${sp.tenSp}`,
          value: sp.maSp,
          tenGoc: sp.tenSp,
          donGia: sp.donGia
        }));
      },
      error: () => console.warn('Chưa có API Sản Phẩm')
    });
  }

  layDanhSachVoucher() {
    const apiUrl = environment.fshopApiUrl + '/api/Voucher';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        const dsVoucher = data || [];

        const voucherConHieuLuc = dsVoucher.filter(voucher =>
          this.kiemTraVoucherConHieuLuc(voucher)
        );

        this.danhSachVoucher = [
          {
            label: '-- Không sử dụng --',
            value: null,
            maVoucher: null,
            tenVoucher: 'Không sử dụng',
            laKhongSuDung: true
          },
          ...voucherConHieuLuc.map(voucher => ({
            label: this.taoLabelVoucher(voucher),
            value: this.layMaVoucher(voucher),
            ...voucher
          })),
          {
            label: 'Thêm voucher mới',
            value: this.GIA_TRI_THEM_VOUCHER,
            laThemMoi: true
          }
        ];
      },
      error: (err) => {
        console.error('Lỗi tải voucher:', err);

        this.danhSachVoucher = [
          {
            label: '-- Không sử dụng --',
            value: null,
            maVoucher: null,
            tenVoucher: 'Không sử dụng',
            laKhongSuDung: true
          },
          {
            label: 'Thêm voucher mới',
            value: this.GIA_TRI_THEM_VOUCHER,
            laThemMoi: true
          }
        ];

        this.messageService.add({
          severity: 'warn',
          summary: 'Voucher',
          detail: 'Không thể tải danh sách voucher'
        });
      }
    });
  }

  layDanhSachKhachHang(callback?: () => void) {
    const apiUrl = environment.fshopApiUrl + '/api/KhachHang';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachKhachHang = (data || []).map(kh => {
          const maKH = kh.maKH || kh.maKh || kh.maKhachHang;
          const tenKH = kh.tenKH || kh.tenKh || kh.tenKhachHang || '';
          const sdt = kh.sdt || '';

          return {
            label: `${maKH} - ${tenKH}${sdt ? ' - ' + sdt : ''}`,
            value: maKH,
            maKH: maKH,
            tenKH: tenKH,
            sdt: sdt,
            diaChi: kh.diaChi || ''
          };
        });

        this.capNhatGoiYKhachHangTaoDon();

        if (callback) {
          callback();
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải danh sách khách hàng:', err);
        this.danhSachKhachHang = [];
        this.danhSachGoiYKhachHangTaoDon = [];

        if (callback) {
          callback();
        }

        this.cdr.detectChanges();
      }
    });
  }

  laVoucherGiamPhanTram(voucher: any): boolean {
    const loaiGiam = (voucher?.loaiGiam || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');

    return (
      loaiGiam.includes('%') ||
      loaiGiam.includes('phantram') ||
      loaiGiam.includes('phan_tram') ||
      loaiGiam.includes('phan tram') ||
      loaiGiam.includes('percent') ||
      loaiGiam.includes('percentage') ||
      loaiGiam.includes('tyle') ||
      loaiGiam.includes('ty le') ||
      loaiGiam.includes('ti le')
    );
  }

  xuLyChonVoucher(event: any) {
    const giaTri = event?.value;

    if (giaTri === this.GIA_TRI_THEM_VOUCHER) {
      setTimeout(() => {
        this.donHangMoi.maVoucher = null;
        this.cdr.detectChanges();
      }, 0);

      this.moDialogTaoVoucher();
    }
  }

  taoMaVoucherMoi(): string {
    const danhSachMa = (this.danhSachVoucher || [])
      .filter((v: any) => !v.laThemMoi && !v.laKhongSuDung)
      .map((v: any) => this.layMaVoucher(v))
      .filter((ma: string) => ma);

    if (danhSachMa.length === 0) {
      return 'VC001';
    }

    let soLonNhat = 0;
    let doDaiSo = 3;
    let tienTo = 'VC';

    danhSachMa.forEach((ma: string) => {
      const match = ma.match(/^([A-Za-z]+)(\d+)$/);

      if (match) {
        const prefix = match[1];
        const numberPart = match[2];
        const numberValue = Number(numberPart);

        if (!isNaN(numberValue) && numberValue > soLonNhat) {
          soLonNhat = numberValue;
          doDaiSo = numberPart.length;
          tienTo = prefix;
        }
      }
    });

    const soMoi = soLonNhat + 1;
    const soMoiDangChuoi = soMoi.toString().padStart(doDaiSo, '0');

    return `${tienTo}${soMoiDangChuoi}`;
  }

  dongDialogTaoVoucher() {
    this.hienThiDialogTaoVoucher = false;

    if (this.donHangMoi.maVoucher === this.GIA_TRI_THEM_VOUCHER) {
      this.donHangMoi.maVoucher = null;
    }

    this.cdr.detectChanges();
  }

  moDialogTaoVoucher() {
    const homNay = new Date();
    const yyyy = homNay.getFullYear();
    const mm = String(homNay.getMonth() + 1).padStart(2, '0');
    const dd = String(homNay.getDate()).padStart(2, '0');

    const ngayHienTai = `${yyyy}-${mm}-${dd}`;

    this.voucherMoi = {
      maVoucher: this.taoMaVoucherMoi(),
      tenVoucher: '',
      ngayBd: ngayHienTai,
      ngayKt: ngayHienTai,
      giaTriGiam: 0,
      loaiGiam: 'PhanTram',
      dieuKienApDung: 0,
      soLuong: 1
    };

    this.hienThiDialogTaoVoucher = true;
  }

  taoVoucherMoi() {
    if (!this.voucherMoi.maVoucher?.trim()) {
      this.voucherMoi.maVoucher = this.taoMaVoucherMoi();
    }

    if (!this.voucherMoi.tenVoucher?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu tên voucher',
        detail: 'Vui lòng nhập tên voucher'
      });
      return;
    }

    if (!this.voucherMoi.ngayBd || !this.voucherMoi.ngayKt) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu ngày',
        detail: 'Vui lòng nhập ngày bắt đầu và ngày kết thúc'
      });
      return;
    }

    if (new Date(this.voucherMoi.ngayBd) > new Date(this.voucherMoi.ngayKt)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ngày không hợp lệ',
        detail: 'Ngày bắt đầu không được lớn hơn ngày kết thúc'
      });
      return;
    }

    if (Number(this.voucherMoi.giaTriGiam) <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giá trị giảm không hợp lệ',
        detail: 'Giá trị giảm phải lớn hơn 0'
      });
      return;
    }

    if (this.voucherMoi.loaiGiam === 'PhanTram' && Number(this.voucherMoi.giaTriGiam) > 100) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Phần trăm không hợp lệ',
        detail: 'Voucher giảm theo phần trăm không được lớn hơn 100%'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/Voucher';

    const body = {
      maVoucher: this.voucherMoi.maVoucher.trim(),
      tenVoucher: this.voucherMoi.tenVoucher.trim(),
      ngayBd: this.voucherMoi.ngayBd,
      ngayKt: this.voucherMoi.ngayKt,
      giaTriGiam: Number(this.voucherMoi.giaTriGiam || 0),
      loaiGiam: this.voucherMoi.loaiGiam,
      dieuKienApDung: Number(this.voucherMoi.dieuKienApDung || 0),
      soLuong: Number(this.voucherMoi.soLuong || 0)
    };

    this.http.post(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã thêm voucher mới'
        });

        this.hienThiDialogTaoVoucher = false;

        this.donHangMoi.maVoucher = body.maVoucher;
        this.layDanhSachVoucher();
      },
      error: (err) => {
        console.error('Lỗi thêm voucher:', err);

        const loi =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || err.error?.title || 'Không thể thêm voucher';

        this.messageService.add({
          severity: 'error',
          summary: 'Thêm voucher thất bại',
          detail: loi
        });
      }
    });
  }

  kiemTraVoucherConHieuLuc(voucher: any): boolean {
    const maVoucher = this.layMaVoucher(voucher);

    if (!maVoucher) {
      return false;
    }

    const soLuong = Number(voucher.soLuong ?? voucher.soluong ?? 0);

    if (soLuong <= 0) {
      return false;
    }

    const ngayHienTai = new Date();
    ngayHienTai.setHours(0, 0, 0, 0);

    const ngayBatDauRaw = voucher.ngayBd || voucher.ngayBD || voucher.ngayBatDau || voucher.ngay_bat_dau;
    const ngayKetThucRaw = voucher.ngayKt || voucher.ngayKT || voucher.ngayKetThuc || voucher.ngay_ket_thuc;

    if (ngayBatDauRaw) {
      const ngayBatDau = new Date(ngayBatDauRaw);
      ngayBatDau.setHours(0, 0, 0, 0);

      if (!isNaN(ngayBatDau.getTime()) && ngayHienTai < ngayBatDau) {
        return false;
      }
    }

    if (ngayKetThucRaw) {
      const ngayKetThuc = new Date(ngayKetThucRaw);
      ngayKetThuc.setHours(23, 59, 59, 999);

      if (!isNaN(ngayKetThuc.getTime()) && ngayHienTai > ngayKetThuc) {
        return false;
      }
    }

    return true;
  }

  layMaVoucher(voucher: any): string {
    return voucher?.maVoucher || voucher?.maVOUCHER || voucher?.id || '';
  }

  layTenVoucher(voucher: any): string {
    return voucher?.tenVoucher || voucher?.tenVOUCHER || voucher?.ten || '';
  }

  taoLabelVoucher(voucher: any): string {
    const maVoucher = this.layMaVoucher(voucher);
    const tenVoucher = this.layTenVoucher(voucher);

    const giaTriGiam = Number(voucher.giaTriGiam ?? 0);
    const dieuKienApDung = Number(voucher.dieuKienApDung ?? 0);

    let hienThiGiam = '';

    if (this.laVoucherGiamPhanTram(voucher)) {
      hienThiGiam = `Giảm ${giaTriGiam}%`;
    } else {
      hienThiGiam = `Giảm ${this.dinhDangTien(giaTriGiam)} đ`;
    }

    let dieuKienText = '';

    if (dieuKienApDung > 0) {
      dieuKienText = `cho đơn từ ${this.rutGonTienVoucher(dieuKienApDung)}`;
    }

    return `${maVoucher} - ${tenVoucher} ${dieuKienText} (${hienThiGiam})`;
  }

  rutGonTienVoucher(value: number): string {
    const so = Number(value || 0);

    if (so >= 1000000) {
      return `${so / 1000000}tr`;
    }

    if (so >= 1000) {
      return `${so / 1000}k`;
    }

    return `${so}`;
  }

  dinhDangTien(value: number): string {
    return Number(value || 0).toLocaleString('vi-VN');
  }

  capNhatGoiYKhachHangTaoDon() {
    this.danhSachGoiYKhachHangTaoDon = this.danhSachKhachHang
      .filter((kh: any) => kh.sdt)
      .map((kh: any) => ({
        label: `${kh.sdt} - ${kh.tenKH}`,
        value: kh.sdt,
        maKH: kh.maKH || kh.value,
        tenKH: kh.tenKH,
        sdt: kh.sdt,
        khachHang: kh,
        laThemMoi: false
      }));
  }

  locGoiYKhachHangTaoDon(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase().trim() : '';

    const ketQua = this.danhSachGoiYKhachHangTaoDon.filter((item: any) =>
      item.label.toLowerCase().includes(tuKhoa) ||
      item.sdt.toLowerCase().includes(tuKhoa) ||
      item.tenKH.toLowerCase().includes(tuKhoa)
    );

    if (ketQua.length === 0 && tuKhoa) {
      this.goiYKhachHangTaoDon = [
        {
          label: `+ Thêm khách hàng mới`,
          value: event.query,
          sdt: event.query,
          laThemMoi: true
        }
      ];
    } else {
      this.goiYKhachHangTaoDon = ketQua;
    }
  }

  chonKhachHangTaoDon(event: any) {
    const item = event.value;

    if (!item) {
      return;
    }

    if (item.laThemMoi) {
      this.chuyenSangThemKhachHangMoi(item.sdt);
      return;
    }

    this.sdtTaoDon = item.label;
    this.donHangMoi.maKH = item.maKH;

    this.cdr.detectChanges();
  }

  chuyenSangThemKhachHangMoi(sdt: string) {
    const soDienThoai = sdt || '';

    const url =
      `/app/khach-hang?moThemKhach=true` +
      `&sdt=${encodeURIComponent(soDienThoai)}`;

    window.location.href = url;
  }

  themVaoGioHang() {
    if (!this.maSpTam || !this.maSpTam.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chú ý',
        detail: 'Chưa chọn sản phẩm!'
      });
      return;
    }

    const spDaCo = this.donHangMoi.danhSachChiTiet.find((x: any) => x.maSp === this.maSpTam);

    if (spDaCo) {
      spDaCo.soLuong += this.soLuongTam;
    } else {
      const thongTinSp = this.danhSachSanPham.find(x => x.value === this.maSpTam);
      const tenCuaHoa = thongTinSp ? thongTinSp.tenGoc : '';
      const donGia = thongTinSp ? Number(thongTinSp.donGia || 0) : 0;

      this.donHangMoi.danhSachChiTiet.push({
        maSp: this.maSpTam.toUpperCase(),
        tenSp: tenCuaHoa,
        soLuong: this.soLuongTam,
        donGia: donGia
      });
    }

    this.maSpTam = '';
    this.soLuongTam = 1;
  }

  layVoucherDangChon(): any {
    const maVoucher = this.donHangMoi?.maVoucher;

    if (!maVoucher) {
      return null;
    }

    return this.danhSachVoucher.find((v: any) =>
      v.maVoucher === maVoucher ||
      v.value === maVoucher
    );
  }

  coVoucherDuocChon(): boolean {
    return !!this.layVoucherDangChon();
  }

  layTenVoucherDayDu(): string {
    const voucher = this.layVoucherDangChon();
    if (!voucher) return 'Không sử dụng';

    const ma = voucher.maVoucher || voucher.value || '';
    const ten = voucher.tenVoucher || '';

    return ten ? `${ma} - ${ten}` : ma;
  }

  tinhTongTienGoc(): number {
    return this.donHangMoi.danhSachChiTiet.reduce((sum: number, item: any) => {
      return sum + Number(item.donGia || 0) * Number(item.soLuong || 0);
    }, 0);
  }

  voucherHopLe(): boolean {
    const voucher = this.layVoucherDangChon();
    if (!voucher) return false;

    const tongTienGoc = this.tinhTongTienGoc();

    if (voucher.soLuong !== undefined && Number(voucher.soLuong) <= 0) {
      return false;
    }

    if (voucher.dieuKienApDung && tongTienGoc < Number(voucher.dieuKienApDung)) {
      return false;
    }

    const now = new Date();

    if (voucher.ngayBd) {
      const ngayBd = new Date(voucher.ngayBd);
      if (ngayBd > now) return false;
    }

    if (voucher.ngayKt) {
      const ngayKt = new Date(voucher.ngayKt);
      ngayKt.setHours(23, 59, 59, 999);
      if (ngayKt < now) return false;
    }

    return true;
  }

  hienThiMoTaVoucher(): string {
    const voucher = this.layVoucherDangChon();
    if (!voucher) return 'Không sử dụng';

    const giaTriGiam = Number(voucher.giaTriGiam || 0);

    if (this.laVoucherGiamPhanTram(voucher)) {
      return `-${giaTriGiam}%`;
    }

    return `-${giaTriGiam.toLocaleString('vi-VN')} đ`;
  }

  tinhTienGiamVoucher(): number {
    const voucher = this.layVoucherDangChon();

    if (!voucher) {
      return 0;
    }

    const tongGoc = this.tinhTongTienGoc();
    const giaTriGiam = Number(voucher.giaTriGiam || 0);
    const dieuKienApDung = Number(voucher.dieuKienApDung || 0);

    if (dieuKienApDung > 0 && tongGoc < dieuKienApDung) {
      return 0;
    }

    if (this.laVoucherGiamPhanTram(voucher)) {
      return Math.round(tongGoc * giaTriGiam / 100);
    }

    return giaTriGiam;
  }

  tinhTongTienThanhToan(): number {
    return Math.max(this.tinhTongTienGoc() - this.tinhTienGiamVoucher(), 0);
  }

  tinhTongTienDonMoi(): number {
    if (!this.donHangMoi || !this.donHangMoi.danhSachChiTiet) return 0;
    return this.donHangMoi.danhSachChiTiet.reduce((tong: number, sp: any) => tong + (sp.thanhTien || 0), 0);
  }

  xoaKhoiGioHang(index: number) {
    this.donHangMoi.danhSachChiTiet.splice(index, 1);
  }

  taoDonHangMoi() {
    if (!this.donHangMoi.maKH) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu khách hàng',
        detail: 'Vui lòng nhập số điện thoại và chọn khách hàng trước khi tạo đơn'
      });
      return;
    }

    if (!this.donHangMoi.danhSachChiTiet || this.donHangMoi.danhSachChiTiet.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Giỏ trống',
        detail: 'Phải có ít nhất 1 sản phẩm!'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/DonHang/admin';

    const body = {
      maKH: this.donHangMoi.maKH,
      maPTTT: this.donHangMoi.maPTTT,
      maVoucher: this.donHangMoi.maVoucher || null,
      danhSachChiTiet: this.donHangMoi.danhSachChiTiet.map((ct: any) => ({
        maSp: ct.maSp,
        soLuong: ct.soLuong
      }))
    };

    this.http.post(apiUrl, body).subscribe({
      next: () => {
  const chiTietDaTao = [...this.donHangMoi.danhSachChiTiet];

  this.congTonKhoBuSauKhiTaoDon(chiTietDaTao, () => {
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã tạo đơn hàng'
    });

    this.hienThiDialogTaoDon = false;
    this.layDanhSachDonHang();
  });
},
      error: (err) => {
        console.error('Lỗi tạo đơn hàng:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Tạo thất bại',
          detail: 'Không thể tạo đơn hàng. Vui lòng kiểm tra khách hàng, sản phẩm hoặc tồn kho!'
        });
      }
    });
  }

  // TÌM KIẾM + LỌC ĐƠN HÀNG

  moHopLoc() {
    this.hienThiHopLoc = true;
  }

  anHopLocKhiNhapTimKiem() {
    const keyword = this.boLocDonHang.keyword?.trim();

    if (keyword) {
      this.hienThiHopLoc = false;
    }
  }

  locDonHang(hienThongBao: boolean = false) {
    const params: any = {};

    if (this.boLocDonHang.maKH && this.boLocDonHang.maKH.trim() !== '') {
      params.MaKH = this.boLocDonHang.maKH.trim();
    }

    if (
      this.boLocDonHang.maTrangThai !== null &&
      this.boLocDonHang.maTrangThai !== undefined
    ) {
      params.MaTrangThai = this.boLocDonHang.maTrangThai;
    }

    if (
      this.boLocDonHang.maPTTT !== null &&
      this.boLocDonHang.maPTTT !== undefined
    ) {
      params.MaPTTT = this.boLocDonHang.maPTTT;
    }

    if (this.boLocDonHang.maVoucher && this.boLocDonHang.maVoucher.trim() !== '') {
      params.MaVoucher = this.boLocDonHang.maVoucher.trim();
    }

    if (this.boLocDonHang.tuNgay) {
      params.TuNgay = this.boLocDonHang.tuNgay;
    }

    if (this.boLocDonHang.denNgay) {
      params.DenNgay = this.boLocDonHang.denNgay;
    }

    if (this.boLocDonHang.maDH && this.boLocDonHang.maDH.trim() !== '') {
      params.Keyword = this.boLocDonHang.maDH.trim();
    } else if (this.boLocDonHang.keyword && this.boLocDonHang.keyword.trim() !== '') {
      params.Keyword = this.boLocDonHang.keyword.trim();
    }

    if (Object.keys(params).length === 0) {
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/DonHang/filter';

    this.http.get<DonHang[]>(apiUrl, { params }).subscribe({
      next: (data) => {
        this.danhSachDonHangGoc = data || [];
        this.danhSachDonHang = [...this.danhSachDonHangGoc];

        this.capNhatDanhSachGoiYTuDonHang(this.danhSachDonHangGoc);
        this.cdr.detectChanges();

        if (hienThongBao) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã áp dụng bộ lọc'
          });
        }
      },
      error: (err) => {
        console.error('Lỗi lọc đơn hàng:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lọc đơn hàng'
        });
      }
    });
  }

  batTatHopLoc() {
    this.hienThiHopLoc = !this.hienThiHopLoc;
    this.cdr.detectChanges();
  }

  timKiemNhanhTuDong() {
    const keyword = this.chuanHoaTuKhoa(this.boLocDonHang.keyword);

    if (!keyword) {
      this.danhSachDonHang = [...this.danhSachDonHangGoc];
      return;
    }

    this.danhSachDonHang = this.danhSachDonHangGoc.filter((dh: any) => {
      const noiDung = [
        dh.maDH,
        dh.maDh,
        dh.maKH,
        dh.tenKhachHang,
        dh.ngayDat,
        dh.tongTien,
        dh.tenTrangThai,
        dh.tenPTTT,
        dh.maVoucher
      ].join(' ');

      return this.chuanHoaTuKhoa(noiDung).includes(keyword);
    });
  }

  xuLyThayDoiTuKhoaTimKiem(value: any) {
    const keyword = value?.toString().trim();

    if (!keyword) {
      this.lamMoiTimKiem();
    }
  }

  chuanHoaTuKhoa(value: any): string {
    return (value ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .trim();
  }

  lamMoiTimKiem() {
    this.boLocDonHang.keyword = '';
    this.goiYTuKhoaTongHop = [];

    if (this.danhSachDonHangGoc.length > 0) {
      this.danhSachDonHang = [...this.danhSachDonHangGoc];
      this.cdr.detectChanges();
      return;
    }

    this.layDanhSachDonHang();
  }

  apDungBoLoc() {
    this.locDonHang(true);
  }

  lamMoiBoLoc() {
    this.boLocDonHang = {
      maDH: '',
      maKH: '',
      maTrangThai: null,
      maPTTT: null,
      maVoucher: '',
      tuNgay: '',
      denNgay: '',
      keyword: ''
    };

    this.layDanhSachDonHang();
  }

  capNhatDanhSachGoiYTuDonHang(data: any[]) {
    this.danhSachMaDH = this.layDanhSachKhongTrung(
      data.map(x => x.maDH).filter(x => x)
    );

    const maKHTrongDonHang = data.map(x => x.maKH).filter(x => x);

    const maKHTuDanhSachKhachHang = this.danhSachKhachHang
      .map((x: any) => x.value || x.maKH)
      .filter(x => x);

    this.danhSachMaKHLoc = this.layDanhSachKhongTrung([
      ...maKHTrongDonHang,
      ...maKHTuDanhSachKhachHang
    ]);

    const voucherTrongDonHang = data.map(x => x.maVoucher).filter(x => x);

    const voucherMau = this.danhSachVoucher
      .filter((x: any) => !x.laThemMoi && !x.laKhongSuDung)
      .map((x: any) => x.value || x.maVoucher)
      .filter((x: any) => x && x !== this.GIA_TRI_THEM_VOUCHER);

    this.danhSachMaVoucherLoc = this.layDanhSachKhongTrung([
      ...voucherTrongDonHang,
      ...voucherMau
    ]);

    const tenKhachHang = data.map(x => x.tenKhachHang).filter(x => x);
    const tenTrangThai = data.map(x => x.tenTrangThai).filter(x => x);
    const tenPTTT = data.map(x => x.tenPTTT).filter(x => x);

    const trangThaiMau = this.danhSachTrangThai.map(x => x.label).filter(x => x);
    const ptttMau = this.danhSachPTTT.map(x => x.label).filter(x => x);

    this.danhSachTuKhoaTongHop = this.layDanhSachKhongTrung([
      ...this.danhSachMaDH,
      ...this.danhSachMaKHLoc,
      ...this.danhSachMaVoucherLoc,
      ...tenKhachHang,
      ...tenTrangThai,
      ...tenPTTT,
      ...trangThaiMau,
      ...ptttMau
    ]).filter(x => x !== this.GIA_TRI_THEM_VOUCHER);
  }

  layDanhSachKhongTrung(ds: string[]): string[] {
    return [...new Set(ds)];
  }

  locGoiYTuKhoaTongHop(event: any) {
    const tuKhoa = this.chuanHoaTuKhoa(event.query);

    this.goiYTuKhoaTongHop = this.danhSachTuKhoaTongHop
      .filter(x => this.chuanHoaTuKhoa(x).includes(tuKhoa))
      .slice(0, 12);
  }

  locGoiYMaDH(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase() : '';

    this.goiYMaDH = this.danhSachMaDH.filter(x =>
      x.toLowerCase().includes(tuKhoa)
    );
  }

  locGoiYMaKH(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase() : '';

    this.goiYMaKH = this.danhSachMaKHLoc.filter(x =>
      x.toLowerCase().includes(tuKhoa)
    );
  }

  locGoiYMaVoucher(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase() : '';

    this.goiYMaVoucher = this.danhSachMaVoucherLoc.filter(x =>
      x.toLowerCase().includes(tuKhoa)
    );
  }

  layChiTietDonHang(donHang: any): any[] {
    return (
      donHang?.chiTiet ||
      donHang?.chiTietDonHangs ||
      donHang?.danhSachChiTiet ||
      []
    );
  }

  layMaVoucherDonHang(donHang: any): string {
    return (
      donHang?.maVoucher ||
      donHang?.maVOUCHER ||
      donHang?.voucher?.maVoucher ||
      donHang?.voucherNavigation?.maVoucher ||
      donHang?.maVoucherNavigation?.maVoucher ||
      ''
    );
  }

  layVoucherTheoMa(maVoucher: string): any {
    if (!maVoucher) return null;

    return this.danhSachVoucher?.find((v: any) =>
      v.maVoucher === maVoucher ||
      v.value === maVoucher
    );
  }

  layTenVoucherDonHang(donHang: any): string {
    const maVoucher = this.layMaVoucherDonHang(donHang);

    if (!maVoucher) {
      return 'Không sử dụng';
    }

    const voucher = this.layVoucherTheoMa(maVoucher);

    if (!voucher) {
      return maVoucher;
    }

    const tenVoucher =
      voucher.tenVoucher ||
      voucher.ten ||
      voucher.label ||
      '';

    if (tenVoucher && tenVoucher.includes(maVoucher)) {
      return tenVoucher;
    }

    return tenVoucher ? `${maVoucher} - ${tenVoucher}` : maVoucher;
  }

  tinhTongTienGocChiTiet(donHang: any): number {
    const chiTiet = this.layChiTietDonHang(donHang);

    return chiTiet.reduce((sum: number, item: any) => {
      const soLuong = Number(item.soLuong || 0);
      const donGia = Number(item.donGia || 0);

      return sum + soLuong * donGia;
    }, 0);
  }

  tinhTienGiamChiTiet(donHang: any): number {
    const maVoucher = this.layMaVoucherDonHang(donHang);

    if (!maVoucher) {
      return 0;
    }

    const tongGoc = this.tinhTongTienGocChiTiet(donHang);
    const tongSauGiam = Number(donHang?.tongTien || 0);

    if (tongGoc > 0 && tongSauGiam > 0 && tongGoc >= tongSauGiam) {
      return tongGoc - tongSauGiam;
    }

    const voucher = this.layVoucherTheoMa(maVoucher);

    if (!voucher) {
      return 0;
    }

    const giaTriGiam = Number(voucher.giaTriGiam || 0);
    const dieuKienApDung = Number(voucher.dieuKienApDung || 0);
    const loaiGiam = (voucher.loaiGiam || '').toString().toLowerCase();

    if (dieuKienApDung > 0 && tongGoc < dieuKienApDung) {
      return 0;
    }

    if (
      loaiGiam.includes('%') ||
      loaiGiam.includes('phantram') ||
      loaiGiam.includes('phan_tram') ||
      loaiGiam.includes('percent') ||
      loaiGiam.includes('percentage') ||
      loaiGiam.includes('tyle') ||
      loaiGiam.includes('tỷ lệ')
    ) {
      return Math.round(tongGoc * giaTriGiam / 100);
    }

    return giaTriGiam;
  }

  tinhTongSauGiamChiTiet(donHang: any): number {
    const tongTienDaLuu = Number(donHang?.tongTien || 0);

    if (tongTienDaLuu > 0) {
      return tongTienDaLuu;
    }

    const tongGoc = this.tinhTongTienGocChiTiet(donHang);
    const tienGiam = this.tinhTienGiamChiTiet(donHang);

    return Math.max(tongGoc - tienGiam, 0);
  }

}