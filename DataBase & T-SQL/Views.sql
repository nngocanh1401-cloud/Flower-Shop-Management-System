-- View 1: Top 10 sản phẩm bán chạy
CREATE VIEW vw_TopSanPhamBanChay AS
SELECT TOP 10
    sp.MaSP,
    sp.TenSP,
    dm.TenDM AS DanhMuc,
    SUM(ct.SoLuong)            AS TongSoBan,
    SUM(ct.SoLuong * ct.DonGia) AS TongDoanhThu
FROM SanPham sp
JOIN DanhMuc dm          ON sp.MaDM  = dm.MaDM
JOIN ChiTietDonHang ct   ON sp.MaSP  = ct.MaSP
JOIN DonHang dh          ON ct.MaDH  = dh.MaDH
WHERE dh.MaTrangThai = 3
GROUP BY sp.MaSP, sp.TenSP, dm.TenDM
ORDER BY TongSoBan DESC;
GO

select * from  vw_TopSanPhamBanChay

-- View 2: Doanh thu theo tháng
CREATE VIEW vw_DoanhThuTheoThang AS
SELECT
    YEAR(NgayDat)  AS Nam,
    MONTH(NgayDat) AS Thang,
    COUNT(MaDH)    AS SoDonHang,
    SUM(TongTien)  AS TongDoanhThu
FROM DonHang
WHERE MaTrangThai = 3
GROUP BY YEAR(NgayDat), MONTH(NgayDat);
GO

select * from  vw_DoanhThuTheoThang


-- View 3: Tồn kho sản phẩm kèm danh mục
CREATE VIEW vw_TonKhoSanPham AS
SELECT
    sp.MaSP, sp.TenSP,
    dm.TenDM AS DanhMuc,
    sp.DonGia,
    sp.SoLuongTon,
    CASE
        WHEN sp.SoLuongTon = 0  THEN N'Hết hàng'
        WHEN sp.SoLuongTon < 20 THEN N'Sắp hết'
        ELSE N'Còn hàng'
    END AS TrangThaiTon
FROM SanPham sp
JOIN DanhMuc dm ON sp.MaDM = dm.MaDM;
GO

select * from  vw_TonKhoSanPham


-- View 4: Chi tiết đơn hàng đầy đủ (join nhiều bảng)
CREATE VIEW vw_ChiTietDonHang AS
SELECT
    dh.MaDH, dh.NgayDat,
    kh.TenKH, kh.SDT,
    pt.TenPTTT AS PhuongThucThanhToan,
    v.TenVoucher,
    tt.TenTrangThai,
    sp.TenSP, ct.SoLuong, ct.DonGia,
    ct.SoLuong * ct.DonGia AS ThanhTien,
    dh.TongTien
FROM DonHang dh
JOIN KhachHang kh               ON dh.MaKH     = kh.MaKH
JOIN PhuongThucThanhToan pt     ON dh.MaPTTT   = pt.MaPTTT
LEFT JOIN Voucher v             ON dh.MaVoucher = v.MaVoucher
JOIN TrangThai tt               ON dh.MaTrangThai = tt.MaTrangThai
JOIN ChiTietDonHang ct         ON dh.MaDH     = ct.MaDH
JOIN SanPham sp                 ON ct.MaSP     = sp.MaSP;
GO
select * from  vw_ChiTietDonHang

-- ADD HAM TRIGGER DR TINH KHI CO VOUCHER