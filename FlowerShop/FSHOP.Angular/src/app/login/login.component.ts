import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  cheDoDoiMatKhau: boolean = false;

  tenDangNhap: string = '';
  matKhau: string = '';

  matKhauCu: string = '';
  matKhauMoi: string = '';

  hienMatKhauDangNhap: boolean = false;
  hienMatKhauCu: boolean = false;
  hienMatKhauMoi: boolean = false;
  tenDangNhapHienTai: string = '';

  dangXuLy: boolean = false;
  thongBaoLoi: string = '';
  thongBaoThanhCong: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cheDoDoiMatKhau = params['mode'] === 'change-password';

      this.thongBaoLoi = '';
      this.thongBaoThanhCong = '';

      if (this.cheDoDoiMatKhau) {
        this.layTenDangNhapHienTai();
      }
    });
  }

  dangNhap() {
    this.thongBaoLoi = '';
    this.thongBaoThanhCong = '';

    if (!this.tenDangNhap.trim() || !this.matKhau.trim()) {
      this.thongBaoLoi = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
      return;
    }

    this.dangXuLy = true;

    this.authService.dangNhap(this.tenDangNhap.trim(), this.matKhau.trim()).subscribe({
      next: () => {
        this.dangXuLy = false;
        this.router.navigate(['/app/bao-cao']);
      },
      error: (err) => {
        console.error('Lỗi đăng nhập:', err);
        this.dangXuLy = false;

        if (err.status === 0) {
          this.thongBaoLoi = 'Không kết nối được đến API. Vui lòng kiểm tra FSHOP Web API.';
        } else if (err.status === 401 || err.status === 400) {
          this.thongBaoLoi = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        } else if (typeof err.error === 'string') {
          this.thongBaoLoi = err.error;
        } else if (err.error?.message) {
          this.thongBaoLoi = err.error.message;
        } else {
          this.thongBaoLoi = 'Đăng nhập thất bại. Vui lòng thử lại.';
        }
      }
    });
  }

  doiMatKhau() {
    this.thongBaoLoi = '';
    this.thongBaoThanhCong = '';

    if (!this.matKhauCu.trim() || !this.matKhauMoi.trim()) {
      this.thongBaoLoi = 'Vui lòng nhập mật khẩu cũ và mật khẩu mới.';
      return;
    }

    if (this.matKhauMoi.length < 6) {
      this.thongBaoLoi = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
      return;
    }

    if (this.matKhauCu === this.matKhauMoi) {
      this.thongBaoLoi = 'Mật khẩu mới không được trùng với mật khẩu cũ.';
      return;
    }

    this.dangXuLy = true;

    this.authService.doiMatKhau(this.matKhauCu, this.matKhauMoi).subscribe({
      next: () => {
        this.dangXuLy = false;

        this.thongBaoThanhCong = 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.';

        this.matKhauCu = '';
        this.matKhauMoi = '';

        this.authService.dangXuat();

        setTimeout(() => {
          this.chuyenVeDangNhap();
        }, 1200);
      },
      error: (err) => {
        console.error('Lỗi đổi mật khẩu:', err);
        this.dangXuLy = false;

        if (err.status === 0) {
          this.thongBaoLoi = 'Không kết nối được API. Vui lòng kiểm tra FSHOP Web API.';
        } else if (err.status === 401) {
          this.thongBaoLoi = 'Bạn cần đăng nhập trước khi đổi mật khẩu.';
        } else if (err.status === 400) {
          this.thongBaoLoi = 'Mật khẩu cũ không đúng hoặc dữ liệu không hợp lệ.';
        } else if (typeof err.error === 'string') {
          this.thongBaoLoi = err.error;
        } else if (err.error?.message) {
          this.thongBaoLoi = err.error.message;
        } else {
          this.thongBaoLoi = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
        }
      }
    });
  }

  chuyenSangDoiMatKhau() {
    this.cheDoDoiMatKhau = true;
    this.thongBaoLoi = '';
    this.thongBaoThanhCong = '';

    this.router.navigate(['/login'], {
      queryParams: {
        mode: 'change-password'
      }
    });
  }

  chuyenVeDangNhap() {
    this.cheDoDoiMatKhau = false;
    this.thongBaoLoi = '';
    this.thongBaoThanhCong = '';

    this.router.navigate(['/login']);
  }

  layTenDangNhapHienTai() {
    const user = this.authService.layThongTinUser();

    this.tenDangNhapHienTai =
      user?.tenDangNhap ||
      user?.username ||
      user?.userName ||
      user?.taiKhoan ||
      user?.data?.tenDangNhap ||
      user?.data?.username ||
      this.tenDangNhap ||
      'Tài khoản hiện tại';
  }
}