import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html', // Trỏ đúng vào file html bạn đang có
  styleUrl: './login.css'
})
export class LoginComponent {
  tenDangNhap = '';
  matKhau     = '';
  loiDangNhap = '';
  dangXuLy    = false;

  constructor(public authService: AuthService, private router: Router) {}

  dangNhap() {
    if (!this.tenDangNhap || !this.matKhau) {
      this.loiDangNhap = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }
    this.dangXuLy = true;
    this.authService.dangNhap(this.tenDangNhap, this.matKhau).subscribe({
      next: (res) => {
        // Điều hướng thông minh theo vai trò
        if (res.vaiTro === 'Admin') {
          this.router.navigate(['/admin']); 
        } else {
          this.router.navigate(['/san-pham']);
        }
      },
      error: (err) => {
        this.loiDangNhap = 'Tên đăng nhập hoặc mật khẩu không đúng';
        this.dangXuLy = false;
      }
    });
  }
}