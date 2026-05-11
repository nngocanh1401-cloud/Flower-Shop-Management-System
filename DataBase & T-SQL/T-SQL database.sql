
use FShop;
go

-- TABLE TRANGTHAI 
create table TrangThai (
MaTrangThai int primary key,
TenTrangThai nvarchar (100) not null,
MoTa nvarchar (255),
LoaiTrangThai varchar(20) not null,
constraint CHK_LoaiTrangThai
check (LoaiTrangThai in ('DonHang','PhieuNhapHang','PhieuTraHang'))
);


-- table NhaCungCap
create table NhaCungCap (
MaNCC nvarchar (10) primary key,
TenNCC nvarchar (100) not null,
DiaChi nvarchar (200),
SDT nvarchar (10),
Email nvarchar (100),
MaSoThue nvarchar (10)
);

-- table KhachHang
create table KhachHang (
MaKH nvarchar (10) primary key,
TenKH nvarchar (100) not null,
SDT nvarchar (10),
DiaChi nvarchar (200)
);

-- table PhuongThucThanhToan
CREATE TABLE PhuongThucThanhToan (
    MaPTTT INT PRIMARY KEY,
    TenPTTT NVARCHAR(50) NOT NULL
);

-- table Voucher
CREATE TABLE Voucher (
    MaVoucher NVARCHAR(10) PRIMARY KEY,
    TenVoucher NVARCHAR(100),
    NgayBD DATE NOT NULL,
    NgayKT DATE NOT NULL,
    GiaTriGiam DECIMAL(18,2) NOT NULL,
    LoaiGiam NVARCHAR(20) NOT NULL,       -- 'PERCENT' hoặc 'FIXED'
    DieuKienApDung DECIMAL(18,2) DEFAULT 0,
    SoLuong INT NOT NULL,
    SoLuongDaDung INT DEFAULT 0
);

-- table DanhMuc
CREATE TABLE DanhMuc (
    MaDM NVARCHAR(10) PRIMARY KEY,
    TenDM NVARCHAR(100) NOT NULL,
    Mota NVARCHAR(200),
    MaDMCha NVARCHAR(10) NULL
        FOREIGN KEY REFERENCES DanhMuc(MaDM)
);
-- table SanPham
CREATE TABLE SanPham (
    MaSP NVARCHAR(10) PRIMARY KEY,
    TenSP NVARCHAR(100) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    SoLuongTon INT NOT NULL DEFAULT 0,
    MaDM NVARCHAR(10)
        FOREIGN KEY REFERENCES DanhMuc(MaDM)
);
-- table DonHang
CREATE TABLE DonHang (
    MaDH NVARCHAR(10) PRIMARY KEY,
    MaKH NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES KhachHang(MaKH),
    MaPTTT INT NOT NULL
        FOREIGN KEY REFERENCES PhuongThucThanhToan(MaPTTT),
    MaVoucher NVARCHAR(10) NULL
        FOREIGN KEY REFERENCES Voucher(MaVoucher),
    MaTrangThai INT NOT NULL
        FOREIGN KEY REFERENCES TrangThai(MaTrangThai),
    NgayDat DATETIME DEFAULT GETDATE(),
    TongTien DECIMAL(18,2) NOT NULL
);
 --table ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    MaDH NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES DonHang(MaDH),
    MaSP NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES SanPham(MaSP),
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (MaDH, MaSP)
);

-- table PhieuNhapHang
CREATE TABLE PhieuNhapHang (
    MaPhieuNhap NVARCHAR(10) PRIMARY KEY,
    MaNCC NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES NhaCungCap(MaNCC),
    MaTrangThai INT NOT NULL
        FOREIGN KEY REFERENCES TrangThai(MaTrangThai),
    NgayNhap DATETIME DEFAULT GETDATE(),
    TongTien DECIMAL(18,2) NOT NULL
);
--table ChiTietNhapHang
CREATE TABLE ChiTietNhapHang (
    MaPhieuNhap NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES PhieuNhapHang(MaPhieuNhap),
    MaSP NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES SanPham(MaSP),
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    HanSuDung DATE,
    PRIMARY KEY (MaPhieuNhap, MaSP)
);
/*--table PhieuTraHang
CREATE TABLE PhieuTraHang (
    MaPhieuTra NVARCHAR(10) PRIMARY KEY,
    MaPhieuNhap NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES PhieuNhapHang(MaPhieuNhap),
    MaTrangThai INT NOT NULL
        FOREIGN KEY REFERENCES TrangThai(MaTrangThai),
    NgayTra DATE,
    LyDo NVARCHAR(200),
    TongTienTra DECIMAL(18,2)
);

-- table ChiTietTraHang
CREATE TABLE ChiTietTraHang (
    MaPhieuTra NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES PhieuTraHang(MaPhieuTra),
    MaSP NVARCHAR(10) NOT NULL
        FOREIGN KEY REFERENCES SanPham(MaSP),
    SoLuong INT NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (MaPhieuTra, MaSP)
);*/


-- them seek data
