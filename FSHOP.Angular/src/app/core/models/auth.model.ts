// src/app/core/models/auth.model.ts
export interface LoginResponse {
  token: string;
  tenDangNhap: string;
  vaiTro: string;
  maKH: string | null;
}