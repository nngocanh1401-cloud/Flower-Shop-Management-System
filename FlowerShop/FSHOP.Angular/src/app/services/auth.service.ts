import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'fshop_token';
  private userKey = 'fshop_user';

  constructor(private http: HttpClient) { }

  dangNhap(tenDangNhap: string, matKhau: string): Observable<any> {
    const apiUrl = environment.fshopApiUrl + '/api/auth/dangnhap';

    const body = {
      tenDangNhap: tenDangNhap,
      matKhau: matKhau
    };

    return this.http.post<any>(apiUrl, body).pipe(
      tap((res) => {
        const token = this.layTokenTuResponse(res);

        if (token) {
          localStorage.setItem(this.tokenKey, token);
        }

        localStorage.setItem(this.userKey, JSON.stringify(res || {}));
      })
    );
  }

  layTokenTuResponse(res: any): string {
    if (!res) return '';

    return (
      res.token ||
      res.accessToken ||
      res.access_token ||
      res.jwtToken ||
      res.data?.token ||
      res.data?.accessToken ||
      ''
    );
  }

  layToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  daDangNhap(): boolean {
    return !!this.layToken();
  }

  layThongTinUser(): any {
    const user = localStorage.getItem(this.userKey);

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  dangXuat() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  doiMatKhau(matKhauCu: string, matKhauMoi: string) {
    const apiUrl = environment.fshopApiUrl + '/api/auth/doimatkhau';

    const body = {
      matKhauCu: matKhauCu,
      matKhauMoi: matKhauMoi
    };

    return this.http.put<any>(apiUrl, body);
  }
}