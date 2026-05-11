# Thiet Ke Backend CRUD San Pham

**Ngay:** 2026-05-11

**Pham vi:** Backend only cho module `SanPham`

**Muc tieu:** Bo sung day du API CRUD co ban cho san pham, giu nguyen cac API doc va filter hien co, dong thoi them validate nghiep vu o tang service de tranh ghi du lieu sai vao database.

## 1. Boi Canh Hien Tai

Codebase dang dung kien truc 3 lop:

- `FSHOP.WEB`: controller API va DI
- `FSHOP.BLL`: xu ly nghiep vu
- `FSHOP.DAL`: repository va Entity Framework
- `FSHOP.Common`: DTO giao tiep giua client va backend

Truoc khi bo sung, module `SanPham` moi co:

- `GET /api/sanpham`
- `GET /api/sanpham/{id}`
- `GET /api/sanpham/tim-kiem`
- `GET /api/sanpham/loc-gia`

Va chua co:

- API tao san pham
- API cap nhat san pham
- API xoa san pham
- DTO rieng cho create/update
- Validate danh muc ton tai
- Validate trung `MaSP`

## 2. Pham Vi Tinh Nang

Tinh nang nay se them:

1. `POST /api/sanpham`
2. `PUT /api/sanpham/{id}`
3. `DELETE /api/sanpham/{id}`
4. DTO rieng cho tao va cap nhat
5. Validate nghiep vu trong `SanPhamService`
6. Dang ky `IDanhMucRepository` trong DI de kiem tra `MaDM`

Tinh nang nay se khong lam:

- Phan trang
- Sap xep
- Upload anh san pham
- Soft delete
- Auth/phan quyen
- Refactor lon o repository `SanPham`

## 3. Nguyen Tac Nghiep Vu

### 3.1 Tao San Pham

- Client phai truyen `MaSP`
- `MaSP` khong duoc rong
- `MaSP` khong duoc trung voi du lieu da ton tai
- `TenSP` khong duoc rong
- `DonGia` phai lon hon `0`
- `SoLuongTon` khong duoc am
- Neu co `MaDM` thi danh muc phai ton tai

### 3.2 Cap Nhat San Pham

- API update lay `id` tu route
- Khong cho phep doi `MaSP` qua request body
- Cho phep cap nhat:
  - `TenSP`
  - `DonGia`
  - `SoLuongTon`
  - `MaDM`
- Van ap dung lai toan bo validate nghiep vu nhu khi tao
- Neu khong tim thay san pham thi tra loi nghiep vu phu hop

### 3.3 Xoa San Pham

- Xoa theo `MaSP`
- Neu san pham khong ton tai thi tra thong bao loi
- Neu san pham dang co du lieu lien quan o bang khac thi bat exception va tra thong bao khong the xoa

## 4. API Thiet Ke

### 4.1 Tao San Pham

**Endpoint:** `POST /api/sanpham`

**Request body:**

```json
{
  "maSP": "SP001",
  "tenSP": "Hoa Hong Do",
  "donGia": 50000,
  "soLuongTon": 20,
  "maDM": "DM01"
}
```

**Thanh cong:**

```json
{
  "message": "Them san pham thanh cong"
}
```

**That bai:**

- `MaSP` rong
- `TenSP` rong
- `DonGia <= 0`
- `SoLuongTon < 0`
- `MaDM` khong ton tai
- `MaSP` da ton tai

### 4.2 Cap Nhat San Pham

**Endpoint:** `PUT /api/sanpham/{id}`

**Request body:**

```json
{
  "tenSP": "Hoa Hong Trang",
  "donGia": 55000,
  "soLuongTon": 15,
  "maDM": "DM01"
}
```

**Thanh cong:**

```json
{
  "message": "Cap nhat san pham thanh cong"
}
```

**That bai:**

- Khong tim thay san pham
- `TenSP` rong
- `DonGia <= 0`
- `SoLuongTon < 0`
- `MaDM` khong ton tai

### 4.3 Xoa San Pham

**Endpoint:** `DELETE /api/sanpham/{id}`

**Thanh cong:**

```json
{
  "message": "Xoa san pham thanh cong"
}
```

**That bai:**

- Khong tim thay san pham
- San pham dang co du lieu lien quan nen khong the xoa

### 4.4 Cac API Giu Nguyen

Van giu nguyen cac API sau:

- `GET /api/sanpham`
- `GET /api/sanpham/{id}`
- `GET /api/sanpham/tim-kiem?keyword=...`
- `GET /api/sanpham/loc-gia?min=...&max=...`

## 5. DTO Thiet Ke

### 5.1 `TaoSanPhamDTO`

Dung cho API tao moi, gom:

- `MaSP`
- `TenSP`
- `DonGia`
- `SoLuongTon`
- `MaDM`

### 5.2 `CapNhatSanPhamDTO`

Dung cho API cap nhat, gom:

- `TenSP`
- `DonGia`
- `SoLuongTon`
- `MaDM`

Khong bao gom `MaSP` de tranh client doi khoa chinh.

## 6. Luong Xu Ly

### 6.1 Tao San Pham

1. Controller nhan `TaoSanPhamDTO`
2. Controller map DTO sang entity `SanPham`
3. Service goi `KiemTraSanPham`
4. Service kiem tra trung `MaSP`
5. Service goi `_sanPhamrepo.Add(...)`
6. Service goi `_sanPhamrepo.Save()`
7. Controller tra `Ok` hoac `BadRequest`

### 6.2 Cap Nhat San Pham

1. Controller nhan `id` tu route va `CapNhatSanPhamDTO`
2. Controller map sang entity tam
3. Service tim san pham hien tai theo `id`
4. Service cap nhat cac truong duoc phep sua
5. Service validate lai du lieu
6. Service goi `_sanPhamrepo.Update(...)`
7. Service goi `_sanPhamrepo.Save()`
8. Controller tra `Ok`, `NotFound`, hoac `BadRequest`

### 6.3 Xoa San Pham

1. Controller nhan `id`
2. Service kiem tra san pham co ton tai khong
3. Service goi `_sanPhamrepo.Delete(id)`
4. Service goi `_sanPhamrepo.Save()`
5. Neu loi rang buoc, service tra thong bao nghiep vu

## 7. Thay Doi Theo Tung Lop

### 7.1 `FSHOP.Common`

Them moi:

- `FSHOP.Common/DTOs/BanHang/TaoSanPhamDTO.cs`
- `FSHOP.Common/DTOs/BanHang/CapNhatSanPhamDTO.cs`

### 7.2 `FSHOP.BLL`

Bo sung trong `SanPhamService`:

- `TaoSanPham(SanPham sp)`
- `CapNhatSanPham(string id, SanPham sp)`
- `XoaSanPham(string id)`
- Mo rong `KiemTraSanPham(...)` de validate day du hon

### 7.3 `FSHOP.WEB`

Bo sung trong `SanPhamController`:

- `POST /api/sanpham`
- `PUT /api/sanpham/{id}`
- `DELETE /api/sanpham/{id}`

Cap nhat `Program.cs`:

- Dang ky them `IDanhMucRepository`

### 7.4 `FSHOP.DAL`

Dieu chinh `ISanPhamRepository` va `SanPhamRepository`:

- Hoan thien `GetByid(string id)` tra ve 1 `SanPham`

Luu y:

- CRUD chinh van dung `IGenericRepository`
- Chua can custom repository method rieng cho create/update/delete

## 8. Response Va Xu Ly Loi

Quy uoc response:

- `Ok(...)` khi thao tac thanh cong
- `NotFound(...)` khi khong tim thay san pham
- `BadRequest(...)` khi validate loi hoac thao tac khong thuc hien duoc

Thong diep loi nghiep vu hien tai duoc tra ve dang chuoi tieng Viet de de test bang Swagger/Postman.

## 9. Rui Ro Va Gioi Han

- Chua co automated test cho CRUD `SanPham`
- Chua build/verify xong toan bo solution trong luc viet spec
- `TimKiemSanPham` va `LocGia` hien dang loc tren du lieu sau khi `GetAll()`, chua toi uu query tu database
- `GetByid` trong repository duoc sua de hoan thien API, nhung service hien dang chu yeu dung `GetById` tu generic repository

## 10. Huong Mo Rong Sau Nay

- Them paging va sorting cho danh sach san pham
- Them filter theo danh muc
- Chuyen validation sang DTO validation attribute neu can
- Bo sung unit test/integration test cho `SanPhamController` va `SanPhamService`
- Toi uu tim kiem va loc gia xuong tang repository thay vi loc in-memory
