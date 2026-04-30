USE FShop;
GO
-- ===============
-- = ThemDonHang =
-- ===============
ALTER PROCEDURE ThemDonHang
 @MaDH NVARCHAR(10),
 @MaKH NVARCHAR(10),
 @MaPTTT INT,
 @MaVoucher NVARCHAR(10),
 @MaTrangThai INT,
 @MaSP NVARCHAR(10),
 @SoLuong INT
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY

		DECLARE @DonGia DECIMAL(18,2)
		SELECT @DonGia = DonGia FROM SanPham WHERE MaSP = @MaSP

		-- Check tồn kho
        IF (SELECT SoLuongTon FROM SanPham WHERE MaSP = @MaSP) < @SoLuong
        BEGIN
            RAISERROR(N'Không đủ hàng trong kho',16,1)
        END

		-- Thêm đơn hàng
        INSERT INTO DonHang(MaDH, MaKH, MaPTTT, MaVoucher, MaTrangThai, NgayDat, TongTien)
        VALUES (@MaDH, @MaKH, @MaPTTT, @MaVoucher, @MaTrangThai, GETDATE(), 0)

		-- ChiTietDonHang
		INSERT INTO ChiTietDonHang(MaDH, MaSP, SoLuong, DonGia)
		VALUES (@MaDH, @MaSP, @SoLuong, @DonGia)

		-- Cập nhật tổng tiền
        UPDATE DonHang
        SET TongTien = @SoLuong * @DonGia
        WHERE MaDH = @MaDH

		COMMIT
    END TRY

    BEGIN CATCH
        ROLLBACK
        PRINT ERROR_MESSAGE()
    END CATCH
END
------------------------
-- TEST THÊM ĐƠN HÀNG --
------------------------
EXEC ThemDonHang 'DH010', 'KH003', 1, NULL, 3, 'SP008', 5
--check
SELECT * FROM DonHang
SELECT * FROM ChiTietDonHang
SELECT * FROM SanPham

---------------------------------------------------

-- ====================
-- = CapNhatTrangThai =
-- ====================
GO
CREATE PROCEDURE CapNhatTrangThai
    @MaDH NVARCHAR(10),
    @MaTrangThai INT
AS
BEGIN
    UPDATE DonHang
    SET MaTrangThai = @MaTrangThai
    WHERE MaDH = @MaDH
END
------------------------
-- TEST THÊM ĐƠN HÀNG --
------------------------
--CapNhatTrangThai
EXEC CapNhatTrangThai 'DH001',3
SELECT * FROM TrangThai

-------------------------------------------------------

-- ==============
-- = XoaDonHang =
-- ==============
GO
CREATE PROCEDURE XoaDonHang
    @MaDH NVARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION

    BEGIN TRY
        DELETE FROM ChiTietDonHang WHERE MaDH = @MaDH
        DELETE FROM DonHang WHERE MaDH = @MaDH

        COMMIT
    END TRY

    BEGIN CATCH
        ROLLBACK
        PRINT ERROR_MESSAGE()
    END CATCH
END
------------------------
-- TEST XOÁ ĐƠN HÀNG --
------------------------
EXEC XoaDonHang 'DH040'
--check
SELECT * FROM DonHang
SELECT * FROM ChiTietDonHang
SELECT * FROM PhieuNhapHang
-----------------------------------------------------

-- =================
-- = ThemPhieuNhap =
-- =================
GO
ALTER PROCEDURE ThemPhieuNhap
@MaPhieuNhap NVARCHAR(10),
@MaNCC NVARCHAR(10),
@MaTrangThai INT,
@MaSP NVARCHAR(10),
@SoLuong INT
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
	DECLARE @DonGia DECIMAL(18,2)

        -- Lấy đơn giá từ sản phẩm
        SELECT @DonGia = DonGia
        FROM SanPham
        WHERE MaSP = @MaSP

        -- Check sản phẩm tồn tại
        IF @DonGia IS NULL
        BEGIN
            RAISERROR(N'Sản phẩm không tồn tại',16,1)
            ROLLBACK
            RETURN
        END
	IF NOT EXISTS (SELECT 1 FROM PhieuNhapHang WHERE MaPhieuNhap=@MaPhieuNhap)
	BEGIN
		INSERT INTO PhieuNhapHang(MaPhieuNhap, MaNCC, MaTrangThai, NgayNhap, TongTien)
        VALUES (@MaPhieuNhap, @MaNCC, @MaTrangThai, GETDATE(), 0)
	END

		-- ChiTietNhapHang
		INSERT INTO ChiTietNhapHang
        VALUES (@MaPhieuNhap, @MaSP, @SoLuong, @DonGia, NULL)

		-- Tổng tiền
        UPDATE PhieuNhapHang
        SET TongTien = TongTien + (@SoLuong * @DonGia)
        WHERE MaPhieuNhap = @MaPhieuNhap

		COMMIT
    END TRY

    BEGIN CATCH
        ROLLBACK
        PRINT ERROR_MESSAGE()
    END CATCH
END

--------------------------
-- TEST THÊM PHIẾU NHẬP --
--------------------------
EXEC ThemPhieuNhap'PN009','NCC002', 6,'SP001', 10
-- check
SELECT * FROM PhieuNhapHang
SELECT * FROM ChiTietNhapHang
SELECT * FROM SanPham
SELECT * FROM NhaCungCap

-----------------------------------------------------------
-- =====================
-- = CapNhatTonKhoNhap =
-- =====================
GO
ALTER TRIGGER CapNhatTonKhoNhap
ON ChiTietNhapHang
AFTER INSERT
AS
BEGIN
    -- Tăng tồn kho theo số lượng nhập
    UPDATE sp
    SET sp.SoLuongTon = sp.SoLuongTon + i.SoLuong
    FROM SanPham sp
    JOIN inserted i ON sp.MaSP = i.MaSP
END

-- =================
-- = CapNhatTonKho =
-- =================
GO
ALTER TRIGGER CapNhatTonKho
ON ChiTietDonHang
AFTER INSERT
AS
BEGIN
    UPDATE sp
    SET SoLuongTon = SoLuongTon - i.SoLuong
    FROM SanPham sp
    JOIN inserted i ON sp.MaSP = i.MaSP
END

-- ==============
-- = HoanTonKho =
-- ==============
GO
ALTER TRIGGER HoanTonKho
ON ChiTietTraHang
AFTER INSERT
AS
BEGIN
    UPDATE sp
    SET SoLuongTon = SoLuongTon + i.SoLuong
    FROM SanPham sp
    JOIN inserted i ON sp.MaSP = i.MaSP
END



