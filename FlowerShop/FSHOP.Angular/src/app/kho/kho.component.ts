import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-kho',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ToastModule,
    DropdownModule,
    ButtonModule,
    InputNumberModule,
    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './kho.component.html',
  styleUrl: './kho.component.css'
})
export class KhoComponent implements OnInit {
  tabDangChon: 'phieuNhap' | 'nhaCungCap' = 'phieuNhap';

  // =============================
  // DATA CHUNG
  // =============================
  danhSachSanPham: any[] = [];
  danhSachNhaCungCap: any[] = [];

  // =============================
  // PHIẾU NHẬP
  // =============================
  danhSachPhieuNhap: any[] = [];
  danhSachPhieuNhapHienThi: any[] = [];
  tuKhoaPhieuNhap: string = '';

  hienThiDialogTaoPhieu = false;
  hienThiDialogChiTietPhieu = false;
  hienThiDialogCapNhatPhieu = false;

  phieuChiTiet: any = null;

  phieuMoi: any = {
    maNCC: '',
    danhSachChiTiet: []
  };

  phieuCapNhat: any = {
    maPhieuNhap: '',
    maNCC: '',
    maTrangThai: 5,
    ngayNhap: ''
  };

  maSPTam: string = '';
  soLuongTam: number = 1;

  danhSachTrangThaiPhieuNhap: any[] = [
    { label: 'Chờ duyệt', value: 5 },
    { label: 'Đã nhập', value: 6 }
  ];

  // =============================
  // NHÀ CUNG CẤP
  // =============================
  danhSachNhaCungCapHienThi: any[] = [];
  tuKhoaNCC: string = '';

  hienThiDialogTaoNCC = false;
  hienThiDialogCapNhatNCC = false;
  hienThiDialogXemNCC = false;

  nccDangXem: any = null;

  nccMoi: any = {
    maNcc: '',
    tenNcc: '',
    diaChi: '',
    sdt: '',
    email: '',
    maSoThue: ''
  };

  nccCapNhat: any = {
    maNcc: '',
    tenNcc: '',
    diaChi: '',
    sdt: '',
    email: '',
    maSoThue: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.taiDuLieuKho();
  }

  taiDuLieuKho() {
    this.layDanhSachSanPham();
    this.layDanhSachNhaCungCap();
    this.layDanhSachPhieuNhap();
  }

  chonTab(tab: 'phieuNhap' | 'nhaCungCap') {
    this.tabDangChon = tab;
  }

  // =====================================================
  // API SẢN PHẨM
  // =====================================================
  layDanhSachSanPham() {
    const apiUrl = environment.fshopApiUrl + '/api/SanPham';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachSanPham = (data || []).map(sp => {
          const maSP = sp.maSP || sp.maSp || sp.ma_sp || '';
          const tenSP = sp.tenSP || sp.tenSp || sp.ten_sp || '';
          const donGia = Number(sp.donGia || sp.giaBan || 0);

          return {
            label: `${maSP} - ${tenSP}`,
            value: maSP,
            maSP,
            tenSP,
            donGia
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải sản phẩm:', err);
        this.messageService.add({
          severity: 'warn',
          summary: 'Sản phẩm',
          detail: 'Không thể tải danh sách sản phẩm'
        });
      }
    });
  }

  // =====================================================
  // API NHÀ CUNG CẤP
  // =====================================================
  layDanhSachNhaCungCap() {
    const apiUrl = environment.fshopApiUrl + '/api/NhaCungCap';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachNhaCungCap = data || [];
        this.danhSachNhaCungCapHienThi = this.danhSachNhaCungCap;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải nhà cung cấp:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách nhà cung cấp'
        });
      }
    });
  }

  timKiemNCC() {
    const keyword = this.chuanHoaTimKiem(this.tuKhoaNCC);

    if (!keyword) {
      this.danhSachNhaCungCapHienThi = this.danhSachNhaCungCap;
      return;
    }

    this.danhSachNhaCungCapHienThi = this.danhSachNhaCungCap.filter(ncc => {
      const noiDungTimKiem = [
        this.layMaNCC(ncc),
        this.layTenNCC(ncc),
        this.laySdtNCC(ncc),
        this.layEmailNCC(ncc),
        this.layDiaChiNCC(ncc),
        this.layMaSoThueNCC(ncc)
      ].join(' ');

      return this.chuanHoaTimKiem(noiDungTimKiem).includes(keyword);
    });
  }

  lamMoiTimKiemNCC() {
    this.tuKhoaNCC = '';
    this.danhSachNhaCungCapHienThi = this.danhSachNhaCungCap;
  }

  moDialogTaoNCC() {
    this.nccMoi = {
      maNcc: '',
      tenNcc: '',
      diaChi: '',
      sdt: '',
      email: '',
      maSoThue: ''
    };

    this.hienThiDialogTaoNCC = true;
  }

  taoNhaCungCap() {
    if (!this.nccMoi.maNcc.trim() || !this.nccMoi.tenNcc.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập mã NCC và tên NCC'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/NhaCungCap';

    const body = {
      maNcc: this.nccMoi.maNcc.trim(),
      tenNcc: this.nccMoi.tenNcc.trim(),
      diaChi: this.nccMoi.diaChi?.trim() || '',
      sdt: this.nccMoi.sdt?.trim() || '',
      email: this.nccMoi.email?.trim() || '',
      maSoThue: this.nccMoi.maSoThue?.trim() || ''
    };

    this.http.post(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã thêm nhà cung cấp'
        });

        this.hienThiDialogTaoNCC = false;
        this.layDanhSachNhaCungCap();
      },
      error: (err) => {
        console.error('Lỗi thêm NCC:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Thêm thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể thêm nhà cung cấp')
        });
      }
    });
  }

  xemNhaCungCap(ncc: any) {
    const maNCC = this.layMaNCC(ncc);

    if (!maNCC) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã NCC',
        detail: 'Không xác định được mã nhà cung cấp'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + `/api/NhaCungCap/${maNCC}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.nccDangXem = data;
        this.hienThiDialogXemNCC = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi xem NCC:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xem thông tin nhà cung cấp'
        });
      }
    });
  }

  moDialogCapNhatNCC(ncc: any) {
    this.nccCapNhat = {
      maNcc: this.layMaNCC(ncc),
      tenNcc: this.layTenNCC(ncc),
      diaChi: this.layDiaChiNCC(ncc),
      sdt: this.laySdtNCC(ncc),
      email: this.layEmailNCC(ncc),
      maSoThue: this.layMaSoThueNCC(ncc)
    };

    this.hienThiDialogCapNhatNCC = true;
  }

  capNhatNhaCungCap() {
    if (!this.nccCapNhat.maNcc || !this.nccCapNhat.tenNcc.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập tên nhà cung cấp'
      });
      return;
    }

    const maNCC = this.nccCapNhat.maNcc;
    const apiUrl = environment.fshopApiUrl + `/api/NhaCungCap/${maNCC}`;

    const body = {
      maNcc: this.nccCapNhat.maNcc,
      tenNcc: this.nccCapNhat.tenNcc.trim(),
      diaChi: this.nccCapNhat.diaChi?.trim() || '',
      sdt: this.nccCapNhat.sdt?.trim() || '',
      email: this.nccCapNhat.email?.trim() || '',
      maSoThue: this.nccCapNhat.maSoThue?.trim() || ''
    };

    this.http.put(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật nhà cung cấp'
        });

        this.hienThiDialogCapNhatNCC = false;
        this.layDanhSachNhaCungCap();
        this.layDanhSachPhieuNhap();
      },
      error: (err) => {
        console.error('Lỗi cập nhật NCC:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Cập nhật thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể cập nhật nhà cung cấp')
        });
      }
    });
  }

  xoaNhaCungCap(ncc: any) {
    const maNCC = this.layMaNCC(ncc);

    if (!maNCC) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã NCC',
        detail: 'Không xác định được mã nhà cung cấp'
      });
      return;
    }

    const dongY = confirm(`Bạn có chắc muốn xóa nhà cung cấp ${maNCC} không?`);

    if (!dongY) return;

    const apiUrl = environment.fshopApiUrl + `/api/NhaCungCap/${maNCC}`;

    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa nhà cung cấp'
        });

        this.layDanhSachNhaCungCap();
      },
      error: (err) => {
        console.error('Lỗi xóa NCC:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Xóa thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể xóa nhà cung cấp')
        });
      }
    });
  }

  // =====================================================
  // API PHIẾU NHẬP
  // =====================================================
  layDanhSachPhieuNhap() {
    const apiUrl = environment.fshopApiUrl + '/api/PhieuNhapHang';

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachPhieuNhap = data || [];
        this.danhSachPhieuNhapHienThi = this.danhSachPhieuNhap;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải phiếu nhập:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách phiếu nhập'
        });
      }
    });
  }

  timKiemPhieuNhap() {
    const keyword = this.chuanHoaTimKiem(this.tuKhoaPhieuNhap);

    if (!keyword) {
      this.danhSachPhieuNhapHienThi = this.danhSachPhieuNhap;
      return;
    }

    this.danhSachPhieuNhapHienThi = this.danhSachPhieuNhap.filter(pn => {
      const maPhieu = this.layMaPhieuNhap(pn);
      const maNCC = this.layMaNCCPhieu(pn);

      const tenNCCTuDanhSach = this.layTenNCCTheoMa(maNCC);
      const tenNCCTuPhieu = pn?.maNccNavigation?.tenNcc || pn?.maNCCNavigation?.tenNCC || '';

      const ngayNhap = this.layNgayNhapPhieu(pn)
        ? new Date(this.layNgayNhapPhieu(pn)).toLocaleDateString('vi-VN')
        : '';

      const tongTien = this.layTongTienPhieu(pn).toString();
      const trangThai = this.layTenTrangThaiPhieu(pn);

      const noiDungTimKiem = [
        maPhieu,
        maNCC,
        tenNCCTuDanhSach,
        tenNCCTuPhieu,
        ngayNhap,
        tongTien,
        trangThai
      ].join(' ');

      return this.chuanHoaTimKiem(noiDungTimKiem).includes(keyword);
    });
  }

  lamMoiTimKiemPhieuNhap() {
    this.tuKhoaPhieuNhap = '';
    this.danhSachPhieuNhapHienThi = this.danhSachPhieuNhap;
  }

  moDialogTaoPhieu() {
    this.phieuMoi = {
      maNCC: '',
      danhSachChiTiet: []
    };

    this.maSPTam = '';
    this.soLuongTam = 1;

    this.hienThiDialogTaoPhieu = true;
  }

  themSanPhamVaoPhieu() {
    if (!this.maSPTam) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu sản phẩm',
        detail: 'Vui lòng chọn sản phẩm nhập'
      });
      return;
    }

    if (!this.soLuongTam || this.soLuongTam <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Số lượng không hợp lệ',
        detail: 'Số lượng phải lớn hơn 0'
      });
      return;
    }

    const spDaCo = this.phieuMoi.danhSachChiTiet.find((x: any) => x.maSP === this.maSPTam);

    if (spDaCo) {
      spDaCo.soLuong += this.soLuongTam;
    } else {
      const sp = this.danhSachSanPham.find(x => x.value === this.maSPTam);

      this.phieuMoi.danhSachChiTiet.push({
        maSP: this.maSPTam,
        tenSP: sp ? sp.tenSP : '',
        donGia: sp ? Number(sp.donGia || 0) : 0,
        soLuong: this.soLuongTam
      });
    }

    this.maSPTam = '';
    this.soLuongTam = 1;
  }

  tinhThanhTienNhap(ct: any): number {
    return Number(ct.donGia || 0) * Number(ct.soLuong || 0);
  }

  tinhTongTienPhieuMoi(): number {
    return this.phieuMoi.danhSachChiTiet.reduce((sum: number, ct: any) => {
      return sum + this.tinhThanhTienNhap(ct);
    }, 0);
  }

  xoaSanPhamKhoiPhieu(index: number) {
    this.phieuMoi.danhSachChiTiet.splice(index, 1);
  }

  taoMaPhieuNhapMoi(): string {
    const danhSachMa = this.danhSachPhieuNhap
      .map((pn: any) => this.layMaPhieuNhap(pn))
      .filter((ma: string) => ma);

    if (danhSachMa.length === 0) {
      return 'PN001';
    }

    let soLonNhat = 0;
    let doDaiSo = 3;
    let tienTo = 'PN';

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

  taoPhieuNhap() {
    if (!this.phieuMoi.maNCC) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu nhà cung cấp',
        detail: 'Vui lòng chọn nhà cung cấp'
      });
      return;
    }

    if (!this.phieuMoi.danhSachChiTiet || this.phieuMoi.danhSachChiTiet.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chưa có sản phẩm',
        detail: 'Vui lòng thêm sản phẩm vào phiếu nhập'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + '/api/PhieuNhapHang';

    const maPhieuNhapMoi = this.taoMaPhieuNhapMoi();

    const body = {
      maPhieuNhap: maPhieuNhapMoi,
      maNCC: this.phieuMoi.maNCC,
      danhSachChiTiet: this.phieuMoi.danhSachChiTiet.map((ct: any) => ({
        maSP: ct.maSP,
        soLuong: ct.soLuong
      }))
    };

    console.log('BODY TẠO PHIẾU NHẬP:', body);

    this.http.post(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã tạo phiếu nhập hàng'
        });

        this.hienThiDialogTaoPhieu = false;
        this.layDanhSachPhieuNhap();
      },
      error: (err) => {
        console.error('Lỗi tạo phiếu nhập:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Tạo thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể tạo phiếu nhập')
        });
      }
    });
  }

  xemChiTietPhieuNhap(pn: any) {
    const maPhieu = this.layMaPhieuNhap(pn);

    if (!maPhieu) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã phiếu',
        detail: 'Không xác định được mã phiếu nhập'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + `/api/PhieuNhapHang/${maPhieu}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.phieuChiTiet = data;
        this.hienThiDialogChiTietPhieu = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi xem chi tiết phiếu:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải chi tiết phiếu nhập'
        });
      }
    });
  }

  dongDialogChiTietPhieu() {
    this.hienThiDialogChiTietPhieu = false;
    this.phieuChiTiet = null;
  }

  moDialogCapNhatPhieu(pn: any) {
    const ngayNhap = this.layNgayNhapPhieu(pn);

    this.phieuCapNhat = {
      maPhieuNhap: this.layMaPhieuNhap(pn),
      maNCC: this.layMaNCCPhieu(pn),
      maTrangThai: this.layMaTrangThaiPhieu(pn) || 5,
      ngayNhap: ngayNhap ? this.dinhDangNgayChoInput(ngayNhap) : ''
    };

    this.hienThiDialogCapNhatPhieu = true;
  }

  capNhatPhieuNhap() {
    if (!this.phieuCapNhat.maPhieuNhap) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã phiếu',
        detail: 'Không xác định được mã phiếu nhập'
      });
      return;
    }

    if (!this.phieuCapNhat.maNCC) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu NCC',
        detail: 'Vui lòng chọn nhà cung cấp'
      });
      return;
    }

    const apiUrl = environment.fshopApiUrl + `/api/PhieuNhapHang/${this.phieuCapNhat.maPhieuNhap}`;

    const body = {
      maNCC: this.phieuCapNhat.maNCC,
      maTrangThai: this.phieuCapNhat.maTrangThai,
      ngayNhap: this.phieuCapNhat.ngayNhap
        ? new Date(this.phieuCapNhat.ngayNhap).toISOString()
        : null
    };

    this.http.put(apiUrl, body).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã cập nhật phiếu nhập'
        });

        this.hienThiDialogCapNhatPhieu = false;
        this.layDanhSachPhieuNhap();
      },
      error: (err) => {
        console.error('Lỗi cập nhật phiếu:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Cập nhật thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể cập nhật phiếu nhập')
        });
      }
    });
  }

  xoaPhieuNhap(pn: any) {
    const maPhieu = this.layMaPhieuNhap(pn);

    if (!maPhieu) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thiếu mã phiếu',
        detail: 'Không xác định được mã phiếu nhập'
      });
      return;
    }

    const dongY = confirm(`Bạn có chắc muốn xóa phiếu nhập ${maPhieu} không?`);

    if (!dongY) return;

    const apiUrl = environment.fshopApiUrl + `/api/PhieuNhapHang/${maPhieu}`;

    this.http.delete(apiUrl).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa phiếu nhập'
        });

        this.layDanhSachPhieuNhap();
      },
      error: (err) => {
        console.error('Lỗi xóa phiếu:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Xóa thất bại',
          detail: this.layThongBaoLoi(err, 'Không thể xóa phiếu nhập')
        });
      }
    });
  }

  // =====================================================
  // HELPER PHIẾU NHẬP
  // =====================================================
  layMaPhieuNhap(pn: any): string {
    return pn?.maPhieuNhap || pn?.maPN || pn?.id || '';
  }

  layMaNCCPhieu(pn: any): string {
    return pn?.maNCC || pn?.maNcc || pn?.maNhaCungCap || pn?.maNccNavigation?.maNcc || '';
  }

  layNgayNhapPhieu(pn: any): any {
    return pn?.ngayNhap || pn?.ngayTao || null;
  }

  layTongTienPhieu(pn: any): number {
    return Number(pn?.tongTien || 0);
  }

  layMaTrangThaiPhieu(pn: any): number {
    return Number(pn?.maTrangThai ?? pn?.maTT ?? 0);
  }

  layTenTrangThaiPhieu(pn: any): string {
    if (pn?.maTrangThaiNavigation?.tenTrangThai) {
      return pn.maTrangThaiNavigation.tenTrangThai;
    }

    const ma = this.layMaTrangThaiPhieu(pn);

    if (ma === 5) return 'Chờ duyệt';
    if (ma === 6) return 'Đã nhập';

    return ma ? `Trạng thái ${ma}` : 'Chưa rõ';
  }

  layChiTietNhapHang(pn: any): any[] {
    return pn?.chiTietNhapHangs ||
      pn?.chiTietNhapHang ||
      pn?.danhSachChiTiet ||
      pn?.chiTiet ||
      [];
  }

  layMaSPChiTiet(ct: any): string {
    return ct?.maSP || ct?.maSp || ct?.ma_sp || '';
  }

  layTenSPChiTiet(ct: any): string {
    if (ct?.maSpNavigation?.tenSp) {
      return ct.maSpNavigation.tenSp;
    }

    if (ct?.maSPNavigation?.tenSP) {
      return ct.maSPNavigation.tenSP;
    }

    const maSP = this.layMaSPChiTiet(ct);
    const sp = this.danhSachSanPham.find(x => x.maSP === maSP || x.value === maSP);

    return sp ? sp.tenSP : '';
  }

  laySoLuongChiTiet(ct: any): number {
    return Number(ct?.soLuong || 0);
  }

  layDonGiaChiTiet(ct: any): number {
    return Number(ct?.donGia || ct?.giaNhap || 0);
  }

  layThanhTienChiTiet(ct: any): number {
    return this.laySoLuongChiTiet(ct) * this.layDonGiaChiTiet(ct);
  }

  layHanSuDungChiTiet(ct: any): any {
    return ct?.hanSuDung || null;
  }

  // =====================================================
  // HELPER NHÀ CUNG CẤP
  // =====================================================
  layMaNCC(ncc: any): string {
    return ncc?.maNcc || ncc?.maNCC || '';
  }

  layTenNCC(ncc: any): string {
    return ncc?.tenNcc || ncc?.tenNCC || '';
  }

  layDiaChiNCC(ncc: any): string {
    return ncc?.diaChi || '';
  }

  laySdtNCC(ncc: any): string {
    return ncc?.sdt || '';
  }

  layEmailNCC(ncc: any): string {
    return ncc?.email || '';
  }

  layMaSoThueNCC(ncc: any): string {
    return ncc?.maSoThue || '';
  }

  layTenNCCTheoMa(maNCC: string): string {
    if (!maNCC) return '';

    const maCanTim = this.chuanHoaTimKiem(maNCC);

    const ncc = this.danhSachNhaCungCap.find(x =>
      this.chuanHoaTimKiem(this.layMaNCC(x)) === maCanTim
    );

    return ncc ? this.layTenNCC(ncc) : '';
  }

  layDanhSachNCCDropdown(): any[] {
    return this.danhSachNhaCungCap.map(ncc => {
      const ma = this.layMaNCC(ncc);
      const ten = this.layTenNCC(ncc);

      return {
        label: `${ma} - ${ten}`,
        value: ma
      };
    });
  }

  // =====================================================
  // FORMAT & LỖI
  // =====================================================
  dinhDangTien(value: number): string {
    return Number(value || 0).toLocaleString('vi-VN');
  }

  dinhDangNgayChoInput(value: any): string {
    const d = new Date(value);

    if (isNaN(d.getTime())) {
      return '';
    }

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  layThongBaoLoi(err: any, macDinh: string): string {
    if (typeof err?.error === 'string') {
      return err.error;
    }

    if (err?.error?.message) {
      return err.error.message;
    }

    if (err?.error?.title) {
      return err.error.title;
    }

    return macDinh;
  }

  chuanHoaTimKiem(value: any): string {
    return (value || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  }
}