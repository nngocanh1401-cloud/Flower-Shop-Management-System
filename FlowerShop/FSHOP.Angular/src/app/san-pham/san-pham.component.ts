import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService, ConfirmationService } from 'primeng/api'; 


import { environment } from '../../environments/environment';

export interface SanPham {
  maSp: string;
  tenSp: string;
  donGia: number;
  soLuongTon: number;
  maDm: string;
}

@Component({
  selector: 'app-san-pham',
  standalone: true,
  imports: [
    CommonModule, TableModule, FormsModule, InputTextModule, 
    ButtonModule, ToastModule, ConfirmDialogModule, RippleModule,
    DialogModule, InputNumberModule, DropdownModule
  ],
  providers: [MessageService, ConfirmationService], 
  templateUrl: './san-pham.component.html',
  styleUrl: './san-pham.component.css'
})
export class SanPhamComponent implements OnInit {
  danhSachSanPham: SanPham[] = [];
  cols: any[] = [];
  tuKhoaTimKiem: string = '';
  danhSachDanhMuc: any[] = [];
  giaMin: number | null = null;
  giaMax: number | null = null;

  hienThiDialog: boolean = false;
  isEditMode: boolean = false;
  sanPhamThaoTac: SanPham = this.khoiTaoSanPhamMoi();

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'maSp', header: 'Mã SP' },
      { field: 'tenSp', header: 'Tên Sản Phẩm' },
      { field: 'donGia', header: 'Giá Bán' },
      { field: 'soLuongTon', header: 'Tồn Kho' },
      { field: 'maDm', header: 'Danh Mục' }
    ];
    this.layDanhSachSanPham();
    // this.layDanhSachDanhMuc();
    // Thêm vào trong hàm ngOnInit()
    this.danhSachDanhMuc = [
      { tenHienThi: 'DM001 - Hoa Tươi', giaTri: 'DM001' },
      { tenHienThi: 'DM002 - Hoa Hồng', giaTri: 'DM002' },
      { tenHienThi: 'DM003 - Hoa Ly', giaTri: 'DM003' },
      { tenHienThi: 'DM004 - Hoa Ngoại Nhập', giaTri: 'DM004' },
      { tenHienThi: 'DM005 - Phụ Kiện', giaTri: 'DM005' }
    ];
  }

  // Khởi tạo một sản phẩm trống
  khoiTaoSanPhamMoi(): SanPham {
    return { maSp: '', tenSp: '', donGia: 0, soLuongTon: 0, maDm: '' };
  }

  //HIỂN THỊ DANH SÁCH SẢN PHẨM
  layDanhSachSanPham() {
    const apiUrl = environment.fshopApiUrl + '/api/SanPham';
    this.http.get<SanPham[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachSanPham = data;
        this.cdr.detectChanges();
      }
    });
  }

  //TÌM KIẾM SẢN PHẨM THEO TÊN
  timKiem() {
    if (!this.tuKhoaTimKiem.trim()) {
      this.layDanhSachSanPham();
      return;
    }
    const apiUrl = environment.fshopApiUrl + `/api/SanPham/tim-kiem?keyword=${this.tuKhoaTimKiem}`;
    this.http.get<SanPham[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachSanPham = data;
        this.cdr.detectChanges();
      }
    });
  }

  //LỌC SẢN PHẨM THEO GIÁ
  locTheoGia() {
    // Ràng buộc phải nhập đủ 2 ô mới cho lọc
    if (this.giaMin === null || this.giaMax === null) {
      this.messageService.add({ severity: 'warn', summary: 'Chú ý', detail: 'Vui lòng nhập đủ khoảng giá cần lọc!' });
      return;
    }
    
    const apiUrl = environment.fshopApiUrl + `/api/SanPham/loc-gia?min=${this.giaMin}&max=${this.giaMax}`;
    
    this.http.get<SanPham[]>(apiUrl).subscribe({
      next: (data) => {
        this.danhSachSanPham = data;
        this.cdr.detectChanges();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lọc giá' })
    });
  }

  // Hủy lọc theo giá
  xoaLocGia() {
    this.giaMin = null;
    this.giaMax = null;

    if (this.tuKhoaTimKiem.trim()) {
      this.timKiem();
    } else {
      this.layDanhSachSanPham();
    }
  }
  //XÓA SẢN PHẨM
  xoaLoc() {
    this.tuKhoaTimKiem = ''; 
    this.layDanhSachSanPham(); 
  }

  xoa(maSp: string) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa sản phẩm <b>${maSp} ${this.danhSachSanPham.find(sp => sp.maSp === maSp)?.tenSp}</b> không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => {
        const apiUrl = environment.fshopApiUrl + `/api/SanPham/${maSp}`;
        this.http.delete(apiUrl).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa sản phẩm' });
            this.layDanhSachSanPham();
          },
          error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm này' })
        });
      }
    });
  }

  // THÊM SẢN PHẨM MỚI
  moDialogThem() {
    this.sanPhamThaoTac = this.khoiTaoSanPhamMoi();
    this.sanPhamThaoTac.maSp = this.phatSinhMaSPMoi(); 
    
    this.isEditMode = false;
    this.hienThiDialog = true;
  }

  // 1. Hàm tính mã tự động
    phatSinhMaSPMoi(): string {
        if (!this.danhSachSanPham || this.danhSachSanPham.length === 0) {
            return 'SP001';
        }

        const danhSachSo = this.danhSachSanPham.map(p => {
            const so = parseInt(p.maSp.replace('SP', ''));
            return isNaN(so) ? 0 : so;
        });
        const soLonNhat = Math.max(...danhSachSo);
        const soTiepTheo = soLonNhat + 1;
      
        return 'SP' + ('000' + soTiepTheo).slice(-3);
    }

    
  // //Hiển thị dropdown danh mục theo API
  // layDanhSachDanhMuc() {
  //   // Thay url này bằng đường dẫn API Danh mục thật của bạn (ví dụ /api/DanhMuc)
  //   const apiUrl = environment.fshopApiUrl + '/api/DanhMuc';

  //   this.http.get<any[]>(apiUrl).subscribe({
  //     next: (data) => {
  //       this.danhSachDanhMuc = data.map(dm => ({
  //         tenHienThi: `${dm.maDm} - ${dm.tenDm}`,
  //         giaTri: dm.maDm
  //       }));
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => {
  //       console.error('Chưa có API Danh mục hoặc lỗi:', err);
  //     }
  //   });
  // }
  // SỬA SẢN PHẨM
  moDialogSua(sp: SanPham) {
    this.sanPhamThaoTac = { ...sp }; // Clone dữ liệu ra để lúc gõ không bị ảnh hưởng trực tiếp lên bảng
    this.isEditMode = true;
    this.hienThiDialog = true;
  }

  // Đóng hộp thoại
  dongDialog() {
    this.hienThiDialog = false;
  }

  // Bấm nút "Lưu" trong hộp thoại
  luuSanPham() {
    //Kiểm tra xem người dùng đã nhập đủ mã và tên chưa
    if (!this.sanPhamThaoTac.maSp || !this.sanPhamThaoTac.tenSp) {
      this.messageService.add({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng nhập Mã và Tên hoa!' });
      return;
    }

    if (this.isEditMode) {
      // Gọi API Cập nhật (PUT)
      const apiUrl = environment.fshopApiUrl + `/api/SanPham/${this.sanPhamThaoTac.maSp}`;
      this.http.put(apiUrl, this.sanPhamThaoTac).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật thông tin hoa' });
          this.hienThiDialog = false;
          this.layDanhSachSanPham();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật' })
      });
    } else {
      // Gọi API Thêm mới (POST)
      const apiUrl = environment.fshopApiUrl + '/api/SanPham';
      // Log ra console để bạn kiểm tra xem dữ liệu có bay đi không
      console.log('Dữ liệu gửi đi:', this.sanPhamThaoTac);

      this.http.post(apiUrl, this.sanPhamThaoTac).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm hoa mới vào kho' });
          this.hienThiDialog = false;
          this.layDanhSachSanPham();
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu. Kiểm tra lại API C#' });
        }
      });
    }
  }
}