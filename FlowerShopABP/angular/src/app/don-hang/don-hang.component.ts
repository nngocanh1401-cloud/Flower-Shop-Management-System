import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
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
    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './don-hang.component.html',
  styleUrl: './don-hang.component.css'
})

export class DonHangComponent implements OnInit {
  danhSachDonHang: DonHang[] = [];

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
  danhSachVoucher: any[] = [];

  maKHTuKhachHang: string = '';
  tenKHTuKhachHang: string = '';
  sdtTuKhachHang: string = '';
  diaChiTuKhachHang: string = '';
  daMoDialogTuKhachHang: boolean = false;

  sdtTaoDon: any = '';

  danhSachGoiYKhachHangTaoDon: any[] = [];
  goiYKhachHangTaoDon: any[] = [];

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
    this.khoiTaoVoucherMau();

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

  // =========================
  // DANH SÁCH ĐƠN HÀNG
  // =========================

  layDanhSachDonHang() {
    const apiUrl = environment.fshopApiUrl + '/api/DonHang';

    this.http.get<DonHang[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachDonHang = data;
        this.capNhatDanhSachGoiYTuDonHang(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải đơn hàng:', err);
      }
    });
  }

  // =========================
  // CHI TIẾT ĐƠN HÀNG
  // =========================

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

    const apiUrl =
      environment.fshopApiUrl +
      `/api/DonHang/${this.donHangChiTiet.maDH}/trangthai?matrangThai=${this.donHangChiTiet.maTrangThai}`;

    this.http.put(apiUrl, {}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật trạng thái đơn hàng'
        });

        this.hienThiDialogChiTiet = false;
        this.layDanhSachDonHang();
      },
      error: (err) => {
        console.error('Lỗi API cập nhật:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật trạng thái'
        });
      }
    });
  }

  // TẠO ĐƠN HÀNG
  moDialogTaoDon(maKHMacDinh: string = '') {
    this.donHangMoi = {
      maDH: this.taoMaDonTuDong(),
      maKH: maKHMacDinh || '',
      maPTTT: 1,
      maVoucher: '',
      danhSachChiTiet: []
    };

    this.sdtTaoDon = '';

    if (maKHMacDinh) {
      const kh = this.danhSachKhachHang.find((x: any) => x.value === maKHMacDinh || x.maKH === maKHMacDinh);

      if (kh) {
        this.sdtTaoDon = `${kh.sdt} - ${kh.tenKH}`;
      }
    }

    this.maSpTam = '';
    this.soLuongTam = 1;
    this.hienThiDialogTaoDon = true;
    this.cdr.detectChanges();
  }

  taoMaDonTuDong(): string {
    if (!this.danhSachDonHang || this.danhSachDonHang.length === 0) {
      return 'DH001';
    }

    const mangSo = this.danhSachDonHang.map(dh => {
      const so = parseInt(dh.maDH.replace(/\D/g, ''));
      return isNaN(so) ? 0 : so;
    });

    const soLonNhat = Math.max(...mangSo);
    const soMoi = soLonNhat + 1;

    return 'DH' + ('000' + soMoi).slice(-3);
  }

  layDanhSachSanPham() {
    this.http.get<any[]>(environment.fshopApiUrl + '/api/SanPham').subscribe({
      next: (data) => {
        this.danhSachSanPham = data.map(sp => ({
          label: `${sp.maSp} - ${sp.tenSp}`,
          value: sp.maSp,
          tenGoc: sp.tenSp,
          donGiaGoc: sp.donGia
        }));
      },
      error: () => {
        console.warn('Chưa có API Sản Phẩm');
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

  khoiTaoVoucherMau() {
    this.danhSachVoucher = [
      { label: '-- Không sử dụng --', value: null },
      { label: 'VC001 - Giảm 10% đơn từ 500k', value: 'VC001' },
      { label: 'VC002 - Giảm 50k đơn từ 300k', value: 'VC002' }
    ];
  }

  // 2. Nút bấm "Thêm vào giỏ"
  themVaoGioHang() {
    if (!this.maSpTam.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Chú ý', detail: 'Chưa nhập Mã Sản Phẩm!' });
      return;
    }

    const spDaCo = this.donHangMoi.danhSachChiTiet.find((x: any) => x.maSp === this.maSpTam);
    const thongTinSp = this.danhSachSanPham.find(x => x.value === this.maSpTam);

    // Lấy đơn giá ra (nếu không tìm thấy thì cho bằng 0)
    const donGia = thongTinSp ? thongTinSp.donGiaGoc : 0;

    if (spDaCo) {
      spDaCo.soLuong += this.soLuongTam;
      spDaCo.thanhTien = spDaCo.soLuong * donGia; // Tính lại thành tiền nếu mua thêm
    } else {
      const tenCuaHoa = thongTinSp ? thongTinSp.tenGoc : '';
      this.donHangMoi.danhSachChiTiet.push({
        maSp: this.maSpTam.toUpperCase(),
        tenSp: tenCuaHoa,
        soLuong: this.soLuongTam,
        donGia: donGia, // Lưu đơn giá vào giỏ
        thanhTien: this.soLuongTam * donGia // Tính thành tiền
      });
    }

    this.maSpTam = '';
    this.soLuongTam = 1;
  }

  // THÊM HÀM NÀY NGAY BÊN DƯỚI ĐỂ TÍNH TỔNG TIỀN ĐƠN MỚI
  tinhTongTienDonMoi(): number {
    if (!this.donHangMoi || !this.donHangMoi.danhSachChiTiet) return 0;
    // Cộng dồn tất cả cột thanhTien trong giỏ hàng lại
    return this.donHangMoi.danhSachChiTiet.reduce((tong: number, sp: any) => tong + (sp.thanhTien || 0), 0);
  }

  xoaKhoiGioHang(index: number) {
    this.donHangMoi.danhSachChiTiet.splice(index, 1);
  }

  taoDonHangMoi() {
    if (!this.donHangMoi.maDH || !this.donHangMoi.maKH) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập Mã ĐH và Mã KH'
      });
      return;
    }

    if (!this.donHangMoi.maKH) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu khách hàng',
        detail: 'Vui lòng nhập số điện thoại và chọn khách hàng trước khi tạo đơn'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/DonHang/admin';

    this.http.post(apiUrl, this.donHangMoi).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo đơn hàng mới!'
        });

        this.hienThiDialogTaoDon = false;
        this.layDanhSachDonHang();
      },
      error: (err) => {
        console.error('Lỗi tạo đơn:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Tạo thất bại',
          detail: 'Sai Mã Khách Hàng hoặc Sản Phẩm không tồn tại!'
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

  @HostListener('document:click', ['$event'])
  xuLyClickRaNgoai(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const dangClickTrongKhungTimKiem = target.closest('.khung-tim-kiem');
    const dangClickTrongPopupPrimeNG =
      target.closest('.p-autocomplete-panel') ||
      target.closest('.p-dropdown-panel');

    if (!dangClickTrongKhungTimKiem && !dangClickTrongPopupPrimeNG) {
      this.hienThiHopLoc = false;
    }
  }

  batTatHopLoc() {
    this.hienThiHopLoc = !this.hienThiHopLoc;
  }

  timKiemNhanh() {
    const keyword = this.boLocDonHang.keyword?.trim();

    if (!keyword) {
      return;
    }

    this.locDonHang(false);
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
        this.danhSachDonHang = data;
        this.capNhatDanhSachGoiYTuDonHang(data);
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

  apDungBoLoc() {
    this.locDonHang(false);
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

  // GỢI Ý KHI NHẬP

  capNhatDanhSachGoiYTuDonHang(data: any[]) {
    this.danhSachMaDH = this.layDanhSachKhongTrung(
      data.map(x => x.maDH).filter(x => x)
    );

    const maKHTrongDonHang = data.map(x => x.maKH).filter(x => x);
    const maKHTuDanhSachKhachHang = this.danhSachKhachHang
      .map(x => x.value)
      .filter(x => x);

    this.danhSachMaKHLoc = this.layDanhSachKhongTrung([
      ...maKHTrongDonHang,
      ...maKHTuDanhSachKhachHang
    ]);

    const voucherTrongDonHang = data.map(x => x.maVoucher).filter(x => x);
    const voucherMau = this.danhSachVoucher
      .map(x => x.value)
      .filter(x => x);

    this.danhSachMaVoucherLoc = this.layDanhSachKhongTrung([
      ...voucherTrongDonHang,
      ...voucherMau
    ]);

    const tenKhachHang = data.map(x => x.tenKhachHang).filter(x => x);

    this.danhSachTuKhoaTongHop = this.layDanhSachKhongTrung([
      ...this.danhSachMaDH,
      ...this.danhSachMaKHLoc,
      ...this.danhSachMaVoucherLoc,
      ...tenKhachHang
    ]);
  }

  layDanhSachKhongTrung(ds: string[]): string[] {
    return [...new Set(ds)];
  }

  locGoiYTuKhoaTongHop(event: any) {
    const tuKhoa = event.query ? event.query.toLowerCase() : '';

    this.goiYTuKhoaTongHop = this.danhSachTuKhoaTongHop.filter(x =>
      x.toLowerCase().includes(tuKhoa)
    );
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
}