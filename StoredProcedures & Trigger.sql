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
			ROLLBACK TRANSACTION
			RETURN
		END

		-- Thêm đơn hàng
        IF NOT EXISTS (SELECT 1 FROM DonHang WHERE MaDH = @MaDH)
		BEGIN
			INSERT INTO DonHang(MaDH, MaKH, MaPTTT, MaVoucher, MaTrangThai, NgayDat, TongTien)
			VALUES (@MaDH, @MaKH, @MaPTTT, @MaVoucher, @MaTrangThai, GETDATE(), 0)
		END

		-- ChiTietDonHang
		IF EXISTS (
			SELECT 1
			FROM ChiTietDonHang
			WHERE MaDH = @MaDH
			AND MaSP = @MaSP
		)
		BEGIN
			RAISERROR(N'Sản phẩm đã tồn tại trong đơn hàng',16,1)
			ROLLBACK TRANSACTION
			RETURN
		END

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
ALTER PROCEDURE CapNhatTrangThai
    @MaDH NVARCHAR(10),
    @MaTrangThai INT
AS
BEGIN
    UPDATE DonHang
    SET MaTrangThai = @MaTrangThai
    WHERE MaDH = @MaDH
END
------------------------------
-- TEST CẬP NHẬT TRẠNG THÁI --
------------------------------
--CapNhatTrangThai
EXEC CapNhatTrangThai 'DH001',3
SELECT * FROM TrangThai

-------------------------------------------------------
-- ==============
-- = HuyDonHang =
-- ==============
GO
ALTER PROCEDURE HuyDonHang
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
------------------------
-- TEST HỦY ĐƠN HÀNG --
------------------------
EXEC HuyDonHang 'DH009'
--check
SELECT * FROM DonHang
SELECT * FROM ChiTietDonHang
SELECT * FROM SanPham
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
-- ================
-- = ThemPhieuTra =
-- ================
GO
ALTER PROCEDURE ThemPhieuTraHang
    @MaPhieuTra NVARCHAR(10),
    @MaPhieuNhap NVARCHAR(10),
    @MaTrangThai NVARCHAR(10),
	@LyDo NVARCHAR(200),
	@MaSP NVARCHAR(10),
    @SoLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION

        DECLARE @DonGia DECIMAL(18,2)

		-- Check sản phẩm có nằm trong phiếu nhập không
		IF NOT EXISTS (
		 SELECT 1
		 FROM ChiTietNhapHang
		 WHERE MaPhieuNhap = @MaPhieuNhap
		 AND MaSP = @MaSP
)
BEGIN
    RAISERROR(N'Sản phẩm không thuộc phiếu nhập này',16,1)
    ROLLBACK
    RETURN
END

        -- Lấy giá từ sản phẩm
        SELECT @DonGia = DonGia FROM SanPham WHERE MaSP = @MaSP

        -- Tạo phiếu nếu chưa có
        IF NOT EXISTS (SELECT 1 FROM PhieuTraHang WHERE MaPhieuTra = @MaPhieuTra)
        BEGIN
            INSERT INTO PhieuTraHang(MaPhieuTra, MaPhieuNhap, MaTrangThai, NgayTra, LyDo, TongTienTra)
            VALUES (@MaPhieuTra, @MaPhieuNhap, @MaTrangThai, GETDATE(), @LyDo, 0)
        END

        -- Thêm chi tiết trả hàng
        INSERT INTO ChiTietTraHang(MaPhieuTra, MaSP, SoLuong, DonGia)
        VALUES (@MaPhieuTra, @MaSP, @SoLuong, @DonGia)

        -- Cập nhật tổng tiền
        UPDATE PhieuTraHang
        SET TongTienTra = TongTienTra + (@SoLuong * @DonGia)
        WHERE MaPhieuTra = @MaPhieuTra

        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK

        DECLARE @Err NVARCHAR(4000)
        SET @Err = ERROR_MESSAGE()
        RAISERROR(@Err,16,1)
    END CATCH
END

-------------------------
-- TEST THÊM PHIẾU TRẢ --
-------------------------
EXEC ThemPhieuTraHang 'PT008', 'PN001', 8, N'Sai loại hoa', 'SP001', 100             

SELECT * FROM SanPham
SELECT * FROM ChiTietNhapHang
SELECT * FROM ChiTietTraHang
SELECT * FROM PhieuTraHang
-----------------------------------------------------------
-- ===================
-- = HuyPhieuTraHang =
-- ===================
GO
ALTER PROCEDURE HuyPhieuTraHang
    @MaPhieuTra NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION

        -- 1. Check tồn tại
        IF NOT EXISTS (SELECT 1 FROM PhieuTraHang WHERE MaPhieuTra = @MaPhieuTra)
        BEGIN
            THROW 50001, N'Phiếu trả hàng không tồn tại', 1;
        END

        -- 2. Check đã huỷ chưa
        IF (SELECT MaTrangThai FROM PhieuTraHang WHERE MaPhieuTra = @MaPhieuTra) = 4
        BEGIN
            THROW 50002, N'Phiếu trả hàng đã huỷ trước đó', 1;
        END

        -- 3. HOÀN KHO
        UPDATE sp
        SET sp.SoLuongTon = sp.SoLuongTon + ct.SoLuong
        FROM SanPham sp
        JOIN ChiTietTraHang ct ON sp.MaSP = ct.MaSP
        WHERE ct.MaPhieuTra = @MaPhieuTra

        -- 4. Cập nhật trạng thái = huỷ
        UPDATE PhieuTraHang
        SET MaTrangThai = 4
        WHERE MaPhieuTra = @MaPhieuTra

        COMMIT
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END
-----------------------------
-- TEST HỦY PHIẾU TRẢ HÀNG --
-----------------------------
EXEC HuyPhieuTraHang 'PT006'
--check
SELECT * FROM SanPham
SELECT * FROM PhieuTraHang
SELECT * FROM ChiTietTraHang
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
    SET SoLuongTon = SoLuongTon - i.SoLuong
    FROM SanPham sp
    JOIN inserted i ON sp.MaSP = i.MaSP
END

SELECT name FROM sys.triggers
SELECT * FROM TrangThai
SELECT * FROM DonHang
SELECT * FROM SanPham
SELECT name, parent_class_desc FROM sys.triggers
EXEC sp_configure 'nested triggers'
SELECT 
    t.name AS TriggerName,
    OBJECT_NAME(t.parent_id) AS TableName
FROM sys.triggers t

-- 1. Xem toàn bộ trigger trên DB
SELECT 
    t.name AS TriggerName,
    OBJECT_NAME(t.parent_id) AS TableName
FROM sys.triggers t
ORDER BY TableName
GO

-- 2. Xem trigger của bảng SanPham
SELECT name
FROM sys.triggers
WHERE parent_id = OBJECT_ID('SanPham')
GO

-- 3. Xem code trigger CapNhatTonKho
sp_helptext 'CapNhatTonKho'
GO

-- 4. Xem code trigger HoanTonKho
sp_helptext 'HoanTonKho'
GO

-- 5. Xem code trigger CapNhatTonKhoNhap
sp_helptext 'CapNhatTonKhoNhap'
GO

-- 6. Xem recursive trigger có bật không
SELECT name, is_recursive_triggers_on
FROM sys.databases
WHERE name = 'FShop'
GO

-- 7. Xem nested trigger
EXEC sp_configure 'nested triggers'
GO
SELECT *
FROM ChiTietDonHang
WHERE MaDH = 'DH010'
AND MaSP = 'SP008'
DELETE FROM ChiTietDonHang
WHERE MaDH = 'DH010'
AND MaSP = 'SP008'