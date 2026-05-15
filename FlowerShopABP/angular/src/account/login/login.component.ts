import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { environment } from '../../environments/environment';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    animations: [accountModuleAnimation()],
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
    tenDangNhap: string = '';
    matKhau: string = '';

    matKhauCu: string = '';
    matKhauMoi: string = '';

    thongBaoLoi: string = '';
    thongBaoThanhCong: string = '';

    dangDoiMatKhau: boolean = false;

    hienMatKhauCu: boolean = false;
    hienMatKhauMoi: boolean = false;
    hienMatKhauDangNhap: boolean = false;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.dangDoiMatKhau = params['mode'] === 'change-password';

            if (this.dangDoiMatKhau) {
                this.tenDangNhap = localStorage.getItem('tenDangNhap') || '';
                this.matKhau = '';
                this.matKhauCu = '';
                this.matKhauMoi = '';
                this.thongBaoLoi = '';
                this.thongBaoThanhCong = '';
            }
        });
    }

    batTatMatKhauDangNhap(): void {
        this.hienMatKhauDangNhap = !this.hienMatKhauDangNhap;
    }

    batTatMatKhauCu(): void {
        this.hienMatKhauCu = !this.hienMatKhauCu;
    }

    batTatMatKhauMoi(): void {
        this.hienMatKhauMoi = !this.hienMatKhauMoi;
    }

    xuLyNutChinh(): void {
        if (this.dangDoiMatKhau) {
            this.doiMatKhau();
        } else {
            this.login();
        }
    }

    login(): void {
        if (!this.tenDangNhap || !this.matKhau) {
            this.thongBaoLoi = 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!';
            this.thongBaoThanhCong = '';
            this.cdr.detectChanges();
            return;
        }

        this.thongBaoLoi = '';
        this.thongBaoThanhCong = '';
        this.cdr.detectChanges();

        const urlDangNhap = environment.fshopApiUrl + '/api/auth/dangnhap';

        const duLieuGuiLen = {
            tenDangNhap: this.tenDangNhap.trim(),
            matKhau: this.matKhau
        };

        this.http.post<any>(urlDangNhap, duLieuGuiLen).subscribe({
            next: (ketQuaTraVe) => {
                localStorage.setItem('token', ketQuaTraVe.token);
                localStorage.setItem('tenDangNhap', ketQuaTraVe.tenDangNhap);

                if (ketQuaTraVe.vaiTro) {
                    localStorage.setItem('vaiTro', ketQuaTraVe.vaiTro);
                }

                if (ketQuaTraVe.maKH) {
                    localStorage.setItem('maKH', ketQuaTraVe.maKH);
                }

                const thoiGianHetHan = new Date();
                thoiGianHetHan.setDate(thoiGianHetHan.getDate() + 1);

                if (typeof abp !== 'undefined') {
                    abp.auth.setToken(ketQuaTraVe.token);
                    abp.utils.setCookieValue(
                        'Abp.AuthToken',
                        ketQuaTraVe.token,
                        thoiGianHetHan,
                        abp.appPath
                    );
                }

                window.location.href = '/app/san-pham';
            },

            error: (loi) => {
                console.error('Lỗi đăng nhập:', loi);

                this.thongBaoThanhCong = '';

                if (typeof loi.error === 'string' && loi.error.trim() !== '') {
                    this.thongBaoLoi = loi.error;
                }
                else if (loi.error && loi.error.message) {
                    this.thongBaoLoi = loi.error.message;
                }
                else if (loi.error && loi.error.title) {
                    this.thongBaoLoi = loi.error.title;
                }
                else if (loi.status === 401) {
                    this.thongBaoLoi = 'Tên đăng nhập hoặc mật khẩu không đúng!';
                }
                else if (loi.status === 400) {
                    this.thongBaoLoi = 'Thông tin đăng nhập không hợp lệ!';
                }
                else if (loi.status === 0) {
                    this.thongBaoLoi = 'Không kết nối được tới API. Vui lòng kiểm tra backend đã chạy chưa!';
                }
                else {
                    this.thongBaoLoi = 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!';
                }

                this.cdr.detectChanges();
            }
        });
    }

    doiMatKhau(): void {
        if (!this.tenDangNhap || !this.matKhauCu || !this.matKhauMoi) {
            this.thongBaoLoi = 'Vui lòng nhập đầy đủ Tên đăng nhập, Mật khẩu cũ và Mật khẩu mới!';
            this.thongBaoThanhCong = '';
            return;
        }

        if (this.matKhauMoi.length < 6) {
            this.thongBaoLoi = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
            this.thongBaoThanhCong = '';
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            this.thongBaoLoi = 'Bạn cần đăng nhập trước khi đổi mật khẩu!';
            this.thongBaoThanhCong = '';
            return;
        }

        this.thongBaoLoi = '';
        this.thongBaoThanhCong = '';

        const urlDoiMatKhau = environment.fshopApiUrl + '/api/auth/doimatkhau';

        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        const duLieuGuiLen = {
            matKhauCu: this.matKhauCu,
            matKhauMoi: this.matKhauMoi
        };

        this.http.put<any>(urlDoiMatKhau, duLieuGuiLen, { headers }).subscribe({
            next: () => {
                alert('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!');

                this.xoaThongTinDangNhap();

                this.dangDoiMatKhau = false;
                this.tenDangNhap = '';
                this.matKhau = '';
                this.matKhauCu = '';
                this.matKhauMoi = '';

                window.location.href = '/account/login';
            },
            error: (loi) => {
                if (loi.error && loi.error.message) {
                    this.thongBaoLoi = loi.error.message;
                } else {
                    this.thongBaoLoi = 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!';
                }

                this.thongBaoThanhCong = '';
            }
        });
    }

    quayLaiDangNhap(): void {
        window.location.href = '/account/login';
    }

    xoaThongTinDangNhap(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('tenDangNhap');
        localStorage.removeItem('vaiTro');
        localStorage.removeItem('maKH');

        if (typeof abp !== 'undefined') {
            abp.auth.clearToken();
            abp.utils.deleteCookie('Abp.AuthToken', abp.appPath);
        }
    }
}