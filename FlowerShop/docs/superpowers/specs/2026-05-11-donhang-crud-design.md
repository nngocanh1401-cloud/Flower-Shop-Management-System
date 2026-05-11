# Thiet Ke Backend CRUD Va Filter Don Hang

**Ngay:** 2026-05-11

**Pham vi:** Backend only cho module `DonHang`

**Muc tieu:** Bo sung day du cac API backend de quan ly don hang theo huong CRUD nghiep vu, bao gom tao don, xem danh sach, xem chi tiet, cap nhat don, cap nhat trang thai, huy don, va filter danh sach don hang.

## 1. Boi Canh Hien Tai

Codebase dang dung kien truc 4 phan:

- `FSHOP.WEB`: API controller va DI
- `FSHOP.BLL`: service xu ly nghiep vu
- `FSHOP.DAL`: repository va Entity Framework
- `FSHOP.Common`: DTO giao tiep giua client va backend

Sau khi bo sung, module `DonHang` dang co:

- API tao don hang
- API lay danh sach don hang
- API lay chi tiet mot don hang
- API cap nhat don hang
- API cap nhat trang thai don hang
- API huy don hang
- API filter danh sach don hang

Tang repository dang ket hop:

- `GenericRepository<DonHang>` cho CRUD co ban
- Custom method bang EF de tao va cap nhat don hang co transaction
- Stored procedure `HuyDonHang` de huy don theo nghiep vu

## 2. Pham Vi Tinh Nang

Tinh nang nay se ho tro:

1. Create don hang
2. Read danh sach don hang
3. Read chi tiet don hang
4. Update thong tin don va danh sach san pham
5. Update rieng trang thai don hang
6. Huy don hang
7. Filter danh sach don hang theo nhieu dieu kien

Tinh nang nay se khong lam:

- Frontend
- Auth/phan quyen
- Phan trang
- Sap xep nang cao
- Xoa cung ban ghi `DonHang`

## 3. Nguyen Tac Nghiep Vu

### 3.1 Tao Don Hang

- Don hang phai co it nhat mot dong san pham
- Cac dong trung `MaSp` duoc gop lai truoc khi luu
- Don gia chi tiet duoc lay tu bang `SanPham`, khong lay tu client
- Kiem tra ton kho truoc khi tru hang
- Neu co voucher:
  - Voucher phai ton tai
  - Voucher phai con hieu luc
  - Voucher phai con luot su dung
  - Don hang phai dat dieu kien ap dung neu co
- `TongTien` duoc tinh lai tren server
- `NgayDat` duoc gan tren server neu chua co

### 3.2 Cap Nhat Don Hang

- Cap nhat theo `MaDH` tren route
- Khong cho client doi `MaDH`
- Cho phep cap nhat:
  - `MaKH`
  - `MaPTTT`
  - `MaVoucher`
  - `DanhSachChiTiet`
- Danh sach chi tiet moi van duoc gop dong trung `MaSp`
- Khi cap nhat:
  - Hoan lai ton kho cua chi tiet cu
  - Xoa danh sach chi tiet cu
  - Tinh lai ton kho theo chi tiet moi
  - Tinh lai tong tien
  - Dieu chinh lai luot su dung voucher neu voucher thay doi

### 3.3 Huy Don Hang

- Huy don duoc expose qua `DELETE /api/donhang/{id}`
- Hien tai logic huy don goi stored procedure `HuyDonHang`
- Neu khong tim thay don hang thi tra loi nghiep vu phu hop
- Neu stored procedure that bai thi tra thong diep loi tu repository

### 3.4 Cap Nhat Trang Thai

- Cho phep cap nhat rieng trang thai qua endpoint rieng
- Neu khong tim thay don hang thi tra `NotFound`
- Neu luu that bai thi tra `BadRequest`

### 3.5 Filter Danh Sach Don Hang

API filter ho tro cac tham so:

- `MaKH`
- `MaTrangThai`
- `MaPTTT`
- `MaVoucher`
- `TuNgay`
- `DenNgay`
- `Keyword` theo `MaDH`

Neu khong truyen filter, API tra ve toan bo danh sach don hang.

## 4. API Thiet Ke

### 4.1 Tao Don Hang

**Endpoint:** `POST /api/donhang`

**Request body:**

```json
{
  "maDH": "DH001",
  "maKH": "KH001",
  "maPTTT": 1,
  "maVoucher": "VC001",
  "danhSachChiTiet": [
    { "maSp": "SP001", "soLuong": 2 },
    { "maSp": "SP002", "soLuong": 1 }
  ]
}
```

**Thanh cong:**

```json
{
  "message": "Đặt hàng thành công"
}
```

### 4.2 Lay Danh Sach Don Hang

**Endpoint:** `GET /api/donhang`

**Response:** danh sach `DonHangDTO`

Moi phan tu gom:

- `MaDH`
- `TenKhachHang`
- `TenPTTT`
- `TenTrangThai`
- `NgayDat`
- `TongTien`

### 4.3 Lay Chi Tiet Don Hang

**Endpoint:** `GET /api/donhang/{id}`

**Response:** object chi tiet don hang gom:

- thong tin don (`MaDH`, `MaKH`, `MaPTTT`, `MaVoucher`, `MaTrangThai`, `NgayDat`, `TongTien`)
- thong tin ten lien quan (`TenKhachHang`, `TenPTTT`, `TenVoucher`, `TenTrangThai`)
- danh sach chi tiet:
  - `MaSP`
  - `TenSP`
  - `SoLuong`
  - `DonGia`
  - `ThanhTien`

Neu khong tim thay don hang thi tra:

```json
{
  "message": "Không tìm thấy đơn hàng"
}
```

### 4.4 Cap Nhat Don Hang

**Endpoint:** `PUT /api/donhang/{id}`

**Request body:**

```json
{
  "maKH": "KH001",
  "maPTTT": 2,
  "maVoucher": "VC002",
  "danhSachChiTiet": [
    { "maSp": "SP001", "soLuong": 3 },
    { "maSp": "SP003", "soLuong": 1 }
  ]
}
```

**Thanh cong:**

```json
{
  "message": "Cập nhật đơn hàng thành công"
}
```

### 4.5 Cap Nhat Trang Thai

**Endpoint:** `PUT /api/donhang/{id}/trangthai?matrangThai=2`

**Thanh cong:**

```json
{
  "message": "Cập nhật trạng thái thành công"
}
```

### 4.6 Huy Don Hang

**Endpoint:** `DELETE /api/donhang/{id}`

**Thanh cong:**

```json
{
  "message": "Hủy đơn hàng thành công"
}
```

### 4.7 Filter Don Hang

**Endpoint:** `GET /api/donhang/filter`

**Query string duoc ho tro:**

- `maKH`
- `maTrangThai`
- `maPTTT`
- `maVoucher`
- `tuNgay`
- `denNgay`
- `keyword`

**Vi du:**

`GET /api/donhang/filter?maKH=KH001&maTrangThai=1`

Hoac:

`GET /api/donhang/filter?tuNgay=2026-05-01&denNgay=2026-05-31&keyword=DH`

## 5. DTO Thiet Ke

### 5.1 `TaoDonHangDTO`

Dung cho API tao don:

- `MaDH`
- `MaKH`
- `MaPTTT`
- `MaVoucher`
- `DanhSachChiTiet`

### 5.2 `CapNhatDonHangDTO`

Dung cho API cap nhat don:

- `MaKH`
- `MaPTTT`
- `MaVoucher`
- `DanhSachChiTiet`

Khong bao gom `MaDH` de tranh doi khoa chinh.

### 5.3 `ChiTietDonHangDTO`

Dung cho create/update:

- `MaSp`
- `SoLuong`

### 5.4 `LocDonHangDTO`

Dung cho filter:

- `MaKH`
- `MaTrangThai`
- `MaPTTT`
- `MaVoucher`
- `TuNgay`
- `DenNgay`
- `Keyword`

### 5.5 `DonHangDTO`

Dung cho man danh sach lich su don hang:

- `MaDH`
- `TenKhachHang`
- `TenPTTT`
- `TenTrangThai`
- `NgayDat`
- `TongTien`

## 6. Luong Xu Ly

### 6.1 Tao Don Hang

1. Controller nhan `TaoDonHangDTO`
2. Controller map DTO sang entity `DonHang`
3. Service gop cac dong trung `MaSp`
4. Repository validate khach hang, PTTT, trang thai, voucher, ton kho
5. Repository tinh tong tien
6. Repository luu don hang va chi tiet trong transaction
7. Repository tru ton kho va tang luot dung voucher neu can
8. Controller tra `Ok` hoac `BadRequest`

### 6.2 Lay Danh Sach / Chi Tiet

1. Controller goi service
2. Service goi repository
3. Repository dung `Include` de nap:
   - `ChiTietDonHangs`
   - `SanPham`
   - `KhachHang`
   - `PhuongThucThanhToan`
   - `TrangThai`
   - `Voucher`
4. Controller map danh sach sang `DonHangDTO` hoac tra object chi tiet

### 6.3 Cap Nhat Don Hang

1. Controller nhan `id` va `CapNhatDonHangDTO`
2. Controller map sang entity tam
3. Service gop dong trung `MaSp`
4. Repository tim don hang hien tai
5. Repository hoan ton kho cho chi tiet cu
6. Repository xoa chi tiet cu
7. Repository validate va tao lai chi tiet moi
8. Repository tinh lai tong tien
9. Repository dieu chinh voucher cu/voucher moi neu can
10. Repository luu thay doi trong transaction

### 6.4 Huy Don Hang

1. Controller nhan `id`
2. Service goi repository
3. Repository kiem tra don co ton tai khong
4. Repository goi stored procedure `HuyDonHang`
5. Controller tra `Ok`, `NotFound`, hoac `BadRequest`

### 6.5 Filter Don Hang

1. Controller nhan `LocDonHangDTO` tu query string
2. Service chuyen filter xuong repository
3. Repository tao query dong theo cac tham so co duoc truyen
4. Ket qua duoc sap giam dan theo `NgayDat`
5. Controller map sang `DonHangDTO`

## 7. Thay Doi Theo Tung Lop

### 7.1 `FSHOP.Common`

Them moi:

- `FSHOP.Common/DTOs/BanHang/CapNhatDonHangDTO.cs`
- `FSHOP.Common/DTOs/BanHang/LocDonHangDTO.cs`

Tai su dung:

- `TaoDonHangDTO`
- `ChiTietDonHangDTO`
- `DonHangDTO`

### 7.2 `FSHOP.WEB`

`DonHangController` hien co cac endpoint:

- `GET /api/donhang`
- `GET /api/donhang/{id}`
- `POST /api/donhang`
- `PUT /api/donhang/{id}`
- `PUT /api/donhang/{id}/trangthai`
- `DELETE /api/donhang/{id}`
- `GET /api/donhang/filter`

### 7.3 `FSHOP.BLL`

`DonHangService` hien co:

- `TaoDonHang`
- `GetAllDonHang`
- `GetById`
- `LocDonHang`
- `CapNhatDonHang`
- `HuyDonHang`
- `CapNhatTrangThai`

### 7.4 `FSHOP.DAL`

`IDonHangRepository` va `DonHangRepository` duoc mo rong de ho tro:

- `GetDanhSach`
- `GetChiTiet`
- `LocDonHang`
- `CapNhatDonHangBangEf`
- `HuyDonHangBangEf`

Repository dung:

- `Include`/`ThenInclude` de lay du lieu lien quan
- transaction cho tao/cap nhat don
- stored procedure cho huy don

## 8. Response Va Xu Ly Loi

Quy uoc response:

- `Ok(...)` khi thanh cong
- `NotFound(...)` khi khong tim thay don hang
- `BadRequest(...)` khi validate loi hoac xu ly nghiep vu that bai

Thong diep loi hien tai duoc tra ve dang chuoi tieng Viet de de test qua Swagger/Postman.

Mot so loi nghiep vu tieu bieu:

- "Danh sách sản phẩm không được rỗng"
- "Không tìm thấy đơn hàng"
- "Không tìm thấy sản phẩm SP001"
- "Mã voucher không tồn tại"
- "Voucher đã hết lượt sử dụng"
- "Phương thức thanh toán ... không hợp lệ"

## 9. Rui Ro Va Gioi Han

- Logic huy don phu thuoc stored procedure `HuyDonHang`
- Chua co automated test cho CRUD/filter `DonHang`
- Chua build/verify xong toan bo project sau thay doi do lenh build bi ngat
- `PUT /api/donhang/{id}/trangthai` hien tai cap nhat truc tiep qua generic repository, chua goi stored procedure `CapNhatTrangThai`
- Phan response chi tiet don hang dang tra anonymous object thay vi DTO rieng

## 10. Huong Mo Rong Sau Nay

- Them DTO rieng cho response chi tiet don hang
- Them paging va sorting cho danh sach/filter
- Hop nhat quy tac cap nhat trang thai qua stored procedure neu can
- Bo sung validation attribute cho DTO
- Them unit test va integration test cho `DonHangController`, `DonHangService`, va `DonHangRepository`
