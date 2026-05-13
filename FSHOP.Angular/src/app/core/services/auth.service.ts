// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  token:       string;
  tenDangNhap: string;
  vaiTro:      string;
  maKH:        string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:7066/api/auth';

  // BehaviorSubject để các component khác subscribe theo dõi trạng thái
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(
    this.getUserFromStorage()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Đăng nhập ────────────────────────────────────────────────
  dangNhap(tenDangNhap: string, matKhau: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/dangnhap`,
      { tenDangNhap, matKhau }).pipe(
      tap(res => {
        // Lưu vào localStorage để giữ login qua reload
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  // ── Đăng ký ──────────────────────────────────────────────────
  dangKy(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dangky`, dto);
  }

  // ── Đăng xuất ────────────────────────────────────────────────
  dangXuat() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ── Getters tiện lợi ─────────────────────────────────────────
  get currentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.vaiTro === 'Admin';
  }

  get token(): string | null {
    return this.currentUser?.token ?? null;
  }

  private getUserFromStorage(): LoginResponse | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }
}