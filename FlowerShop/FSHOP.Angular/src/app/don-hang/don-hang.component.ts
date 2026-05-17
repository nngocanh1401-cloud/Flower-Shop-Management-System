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
        this.danhSachDonHang = data;
        this.capNhatDanhSachGoiYTuDonHang(data);
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
        const voucherTuApi = (data || []).map(v => {
          const maVoucher = v.maVoucher || '';
          const tenVoucher = v.tenVoucher || '';
          const giaTriGiam = v.giaTriGiam || 0;
          const loaiGiam = v.loaiGiam || '';
          const dieuKienApDung = v.dieuKienApDung || 0;
          const soLuong = v.soLuong || 0;

          let moTaGiam = '';

          if (loaiGiam.toLowerCase().includes('phan') || loaiGiam.includes('%')) {
            moTaGiam = `Giảm ${giaTriGiam}%`;
          } else {
            moTaGiam = `Giảm ${giaTriGiam.toLocaleString('vi-VN')}đ`;
          }

          let label = `${maVoucher} - ${tenVoucher || moTaGiam}`;

          if (dieuKienApDung > 0) {
            label += ` - Đơn từ ${dieuKienApDung.toLocaleString('vi-VN')}đ`;
          }

          if (soLuong <= 0) {
            label += ' - Hết lượt';
          }

          return {
            label: label,
            value: maVoucher,
            maVoucher: maVoucher,
            tenVoucher: tenVoucher,
            giaTriGiam: giaTriGiam,
            loaiGiam: loaiGiam,
            dieuKienApDung: dieuKienApDung,
            soLuong: soLuong,
            ngayBd: v.ngayBd,
            ngayKt: v.ngayKt
          };
        });

        this.danhSachVoucher = [
          { label: '-- Không sử dụng --', value: null },
          ...voucherTuApi
        ];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải voucher:', err);

        this.danhSachVoucher = [
          { label: '-- Không sử dụng --', value: null }
        ];

        this.messageService.add({
          severity: 'warn',
          summary: 'Voucher',
          detail: 'Không thể tải danh sách voucher'
        });

        this.cdr.detectChanges();
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

  // 2. Nút bấm "Thêm vào giỏ"
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

  layVoucherDangChon(): any | null {
    const maVoucher = this.donHangMoi?.maVoucher;

    if (!maVoucher) return null;

    return this.danhSachVoucher.find(
      x => x.value === maVoucher || x.maVoucher === maVoucher
    ) || null;
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
    return (this.donHangMoi?.danhSachChiTiet || []).reduce((tong: number, sp: any) => {
      return tong + (Number(sp.donGia || 0) * Number(sp.soLuong || 0));
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
    const loaiGiam = (voucher.loaiGiam || '').toLowerCase();

    if (
      loaiGiam.includes('%') ||
      loaiGiam.includes('phan') ||
      loaiGiam.includes('trăm') ||
      loaiGiam.includes('tram')
    ) {
      return `-${giaTriGiam}%`;
    }

    return `-${giaTriGiam.toLocaleString('vi-VN')} đ`;
  }

  tinhTienGiamVoucher(): number {
    const voucher = this.layVoucherDangChon();
    const tongTienGoc = this.tinhTongTienGoc();

    if (!voucher || !this.voucherHopLe()) return 0;

    const giaTriGiam = Number(voucher.giaTriGiam || 0);
    const loaiGiam = (voucher.loaiGiam || '').toLowerCase();

    let tienGiam = 0;

    if (
      loaiGiam.includes('%') ||
      loaiGiam.includes('phan') ||
      loaiGiam.includes('trăm') ||
      loaiGiam.includes('tram')
    ) {
      tienGiam = tongTienGoc * giaTriGiam / 100;
    } else {
      tienGiam = giaTriGiam;
    }

    if (tienGiam > tongTienGoc) {
      tienGiam = tongTienGoc;
    }

    return Math.round(tienGiam);
  }

  tinhTongTienThanhToan(): number {
    return Math.max(this.tinhTongTienGoc() - this.tinhTienGiamVoucher(), 0);
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
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo đơn hàng mới!'
        });

        this.hienThiDialogTaoDon = false;
        this.layDanhSachDonHang();
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