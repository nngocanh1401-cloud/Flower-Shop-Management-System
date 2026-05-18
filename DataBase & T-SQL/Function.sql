-- Function 1: Tính giảm giá từ voucher
CREATE FUNCTION fn_TinhGiamGia(
    @MaVoucher NVARCHAR(10),
    @TongTien DECIMAL(18,2)
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @GiamGia     DECIMAL(18,2) = 0;
    DECLARE @LoaiGiam    NVARCHAR(20);
    DECLARE @GiaTriGiam  DECIMAL(18,2);
    DECLARE @DieuKien    DECIMAL(18,2);
    DECLARE @ConLai      INT;

    SELECT
        @LoaiGiam   = LoaiGiam,
        @GiaTriGiam = GiaTriGiam,
        @DieuKien   = DieuKienApDung,
        @ConLai     = SoLuong - SoLuongDaDung
    FROM Voucher
    WHERE MaVoucher = @MaVoucher
      AND GETDATE() BETWEEN NgayBD AND NgayKT;

    -- Voucher không hợp lệ hoặc hết lượt
    IF @LoaiGiam IS NULL OR @ConLai <= 0 RETURN 0;
    -- Không đủ điều kiện áp dụng
    IF @TongTien < @DieuKien RETURN 0;

    IF @LoaiGiam = 'PERCENT'
        SET @GiamGia = @TongTien * @GiaTriGiam / 100;
    ELSE
        SET @GiamGia = @GiaTriGiam;

    RETURN @GiamGia;
END;
GO

-- Function 2: Tính tổng tiền 1 đơn hàng (không tính voucher)
CREATE FUNCTION fn_TinhTongTienDon(@MaDH NVARCHAR(10))
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @Tong DECIMAL(18,2);
    SELECT @Tong = SUM(SoLuong * DonGia)
    FROM ChiTietDonHang
    WHERE MaDH = @MaDH;
    RETURN ISNULL(@Tong, 0);
END;
GO

-- Function 3: Lịch sử mua hàng của 1 khách (Table-valued)
CREATE FUNCTION fn_LichSuMuaHang(@MaKH NVARCHAR(10))
RETURNS TABLE
AS
RETURN (
    SELECT
        dh.MaDH, dh.NgayDat,
        dh.TongTien,
        tt.TenTrangThai,
        COUNT(ct.MaSP) AS SoLoaiSP
    FROM DonHang dh
    JOIN TrangThai tt       ON dh.MaTrangThai = tt.MaTrangThai
    JOIN ChiTietDonHang ct  ON dh.MaDH        = ct.MaDH
    WHERE dh.MaKH = @MaKH
    GROUP BY dh.MaDH, dh.NgayDat, dh.TongTien, tt.TenTrangThai
);