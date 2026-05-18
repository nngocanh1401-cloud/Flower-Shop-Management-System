USE FShop;
GO

-- ThemDonHang
CREATE OR ALTER PROCEDURE ThemDonHang
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

-- TEST THÊM ĐƠN HÀNG 
EXEC ThemDonHang 'DH010', 'KH003', 1, NULL, 3, 'SP008', 5
--check
SELECT * FROM DonHang
SELECT * FROM ChiTietDonHang
SELECT * FROM SanPham

--  CapNhatTrangThai 
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
-- TEST CẬP NHẬT TRẠNG THÁI --

--CapNhatTrangThai
EXEC CapNhatTrangThai 'DH001',3
SELECT * FROM TrangThai

--  HuyDonHang 
GO
CREATE OR ALTER PROCEDURE HuyDonHang
    @MaDH NVARCHAR(10)
AS
BEGIN
    BEGIN TRANSACTION
    BEGIN TRY

         -- Check tồn tại
        IF NOT EXISTS (SELECT 1 FROM DonHang WHERE MaDH = @MaDH)
        BEGIN
            THROW 50001, N'Đơn hàng không tồn tại', 1;
        END

        -- Check đã huỷ chưa
        IF (SELECT MaTrangThai FROM DonHang WHERE MaDH = @MaDH) = 4
        BEGIN
            THROW 50002, N'Đơn hàng đã huỷ trước đó', 1;
        END

        -- Hoàn kho
        UPDATE sp
        SET sp.SoLuongTon = sp.SoLuongTon + ct.SoLuong
        FROM SanPham sp
        JOIN ChiTietDonHang ct ON sp.MaSP = ct.MaSP
        WHERE ct.MaDH = @MaDH

		--update trạng thái
		UPDATE DonHang
		SET MaTrangThai = 4
		WHERE MaDH = @MaDH;

        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK;
       THROW;
    END CATCH
END

-- TEST HỦY ĐƠN HÀNG --
EXEC HuyDonHang 'DH006'
--check
SELECT * FROM DonHang
SELECT * FROM ChiTietDonHang
SELECT * FROM SanPham


-- ThemPhieuNhap 
CREATE OR ALTER PROCEDURE ThemPhieuNhap
@MaPhieuNhap NVARCHAR(10),
@MaNCC NVARCHAR(10),
@MaTrangThai INT,
@MaSP NVARCHAR(10),
@SoLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @DonGia DECIMAL(18,2);

        SELECT @DonGia = DonGia
        FROM SanPham
        WHERE MaSP = @MaSP;

        IF @DonGia IS NULL
        BEGIN
            THROW 50001, N'Sản phẩm không tồn tại', 1;
        END

        IF @SoLuong <= 0
        BEGIN
            THROW 50002, N'Số lượng nhập phải lớn hơn 0', 1;
        END

        IF NOT EXISTS (SELECT 1 FROM NhaCungCap WHERE MaNCC = @MaNCC)
        BEGIN
            THROW 50003, N'Nhà cung cấp không tồn tại', 1;
        END

        IF NOT EXISTS (SELECT 1 FROM PhieuNhapHang WHERE MaPhieuNhap = @MaPhieuNhap)
        BEGIN
            INSERT INTO PhieuNhapHang(MaPhieuNhap, MaNCC, MaTrangThai, NgayNhap, TongTien)
            VALUES (@MaPhieuNhap, @MaNCC, @MaTrangThai, GETDATE(), 0);
        END

        IF EXISTS (
            SELECT 1
            FROM ChiTietNhapHang
            WHERE MaPhieuNhap = @MaPhieuNhap
              AND MaSP = @MaSP
        )
        BEGIN
            UPDATE ChiTietNhapHang
            SET SoLuong = SoLuong + @SoLuong
            WHERE MaPhieuNhap = @MaPhieuNhap
              AND MaSP = @MaSP;
        END
        ELSE
        BEGIN
            INSERT INTO ChiTietNhapHang(MaPhieuNhap, MaSP, SoLuong, DonGia, HanSuDung)
            VALUES (@MaPhieuNhap, @MaSP, @SoLuong, @DonGia, NULL);
        END

        UPDATE PhieuNhapHang
        SET TongTien = TongTien + (@SoLuong * @DonGia)
        WHERE MaPhieuNhap = @MaPhieuNhap;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;

        THROW;
    END CATCH
END
GO

-- TEST THÊM PHIẾU NHẬP 
EXEC ThemPhieuNhap'PN009','NCC002', 6,'SP001', 10
-- check
SELECT * FROM PhieuNhapHang
SELECT * FROM ChiTietNhapHang
SELECT * FROM SanPham
SELECT * FROM NhaCungCap


-- CapNhatTonKhoNhap
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

--  CapNhatTonKho 
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

-- Stored Procedure đăng ký tài khoản khách hàng

CREATE PROCEDURE sp_DangKy
    @MaNguoiDung NVARCHAR(10),
    @TenDangNhap NVARCHAR(50),
    @MatKhauHash NVARCHAR(255),
    @TenKH       NVARCHAR(100),
    @SDT         NVARCHAR(15),
    @DiaChi      NVARCHAR(200)
AS
BEGIN
    BEGIN TRANSACTION
    BEGIN TRY
        -- Tạo khách hàng trước
        INSERT INTO KhachHang (MaKH, TenKH, SDT, DiaChi)
        VALUES (@MaNguoiDung, @TenKH, @SDT, @DiaChi);

        -- Tạo tài khoản liên kết
        INSERT INTO NguoiDung (MaNguoiDung, TenDangNhap, MatKhauHash, MaVaiTro, MaKH)
        VALUES (@MaNguoiDung, @TenDangNhap, @MatKhauHash, 2, @MaNguoiDung);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION; THROW;
    END CATCH
END;
