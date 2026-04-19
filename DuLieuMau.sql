use FShop 
go
-- TrangThai (dùng chung cho cả 3 loại phiếu)
INSERT INTO TrangThai VALUES
(1, N'Chờ xử lý',   N'Đơn mới tạo',  'DonHang'),
(2, N'Đang giao', N'Đang giao hàng',  'DonHang'),
(3, N'Hoàn thành', N'Giao thành công', 'DonHang'),
(4, N'Đã hủy',   N'Đơn bị hủy',     'DonHang'),
(5, N'Chờ duyệt', N'Phiếu nhập chờ duyệt',  'PhieuNhapHang'),
(6, N'Đã nhập', N'Đã nhập hàng',    'PhieuNhapHang'),
(7, N'Chờ xử lý',  N'Phiếu trả chờ xử lý',  'PhieuTraHang'),
(8, N'Đã trả',  N'Đã trả hàng cho NCC',     'PhieuTraHang');

-- KIỂM TRA
SELECT * FROM TrangThai ORDER BY MaTrangThai;



-- NhaCungCap
INSERT INTO NhaCungCap VALUES
('NCC001', N'Vườn hoa Đà Lạt',   N'12 Trần Phú, Đà Lạt',    '0901111111', 'dalat@flower.vn',  '0101234567'),
('NCC002', N'Hoa tươi Sài Gòn',  N'45 Lê Lợi, TP.HCM',      '0912222222', 'saigon@flower.vn', '0209876543'),
('NCC003', N'Hoa nhập khẩu ABC', N'78 Nguyễn Huệ, TP.HCM',  '0923333333', 'abc@import.vn',    '0312345678');

-- KhachHang
INSERT INTO KhachHang VALUES
('KH001', N'Nguyễn Ngọc Anh',  '0901234567', N'12 Lê Lai, Q.1, TP.HCM'),
('KH002', N'Bùi Thị Thu Hương',  '0912345678', N'34 Nguyễn Trãi, Q.5, TP.HCM'),
('KH003', N'Lê Thị Huyền',   '0923456789', N'56 Hai Bà Trưng, Q.3, TP.HCM'),
('KH004', N'Bùi Trường Linh',  '0934567890', N'78 Điện Biên Phủ, Bình Thạnh');

-- PhuongThucThanhToan
INSERT INTO PhuongThucThanhToan (TenPTTT) VALUES
(N'Tiền mặt'), (N'Chuyển khoản ngân hàng'), (N'Ví MoMo'), (N'ZaloPay');

-- DanhMuc (có danh mục cha-con)
INSERT INTO DanhMuc VALUES
('DM001', N'Hoa tươi',      N'Các loại hoa tươi', NULL),
('DM002', N'Hoa hồng',      N'Các loại hoa hồng', 'DM001'),
('DM003', N'Hoa ly',        N'Các loại hoa ly',   'DM001'),
('DM004', N'Hoa ngoại nhập',N'Hoa nhập khẩu',     'DM001'),
('DM005', N'Phụ kiện',      N'Ruy băng, giỏ hoa', NULL);

-- Voucher
INSERT INTO Voucher VALUES
('VC001', N'Giảm 10% đơn từ 500k', '2025-01-01','2025-12-31', 10,    'PERCENT', 500000,  100, 0), -- giam phan tram/so tien
('VC002', N'Giảm 50k đơn từ 300k', '2025-01-01','2025-12-31', 50000, 'FIXED',   300000,  50,  0); -- giam tien/so tien


-- SanPham
INSERT INTO SanPham VALUES
('SP001', N'Hoa hồng đỏ',    50000,  200, 'DM002'),
('SP002', N'Hoa hồng vàng',  55000,  150, 'DM002'),
('SP003', N'Hoa ly trắng',   80000,   80, 'DM003'),
('SP004', N'Hoa ly cam',     85000,   60, 'DM003'),
('SP005', N'Hoa tulip tím',  120000,  40, 'DM004'),
('SP006', N'Hoa lan hồ điệp',150000,  30, 'DM004'),
('SP007', N'Ruy băng vàng',   5000,  500, 'DM005'),
('SP008', N'Giỏ mây tròn',   35000,  100, 'DM005');

-- DonHang (MaTrangThai=3 là Hoàn thành, để View doanh thu có dữ liệu)
INSERT INTO DonHang VALUES
('DH001','KH001',1,NULL,    3,'2025-01-15 09:30:00',250000),
('DH002','KH002',2,'VC001', 3,'2025-02-20 14:00:00',360000),
('DH003','KH001',3,'VC002', 3,'2025-03-05 10:15:00',290000),
('DH004','KH003',1,NULL,    2,'2025-04-10 16:00:00',480000),
('DH005','KH004',4,NULL,    1,'2025-04-17 08:00:00',600000);

-- ChiTietDonHang
INSERT INTO ChiTietDonHang VALUES
('DH001','SP001',3, 50000),
('DH001','SP007',5,  5000),
('DH002','SP003',4, 80000),
('DH002','SP001',2, 50000),
('DH003','SP002',4, 55000),
('DH003','SP008',2, 35000),
('DH004','SP005',3,120000),
('DH004','SP006',1,150000),
('DH005','SP006',3,150000),
('DH005','SP005',2,120000);

-- PhieuNhapHang
INSERT INTO PhieuNhapHang VALUES
('PN001','NCC001',6,'2025-01-05 08:00:00',5000000),
('PN002','NCC002',6,'2025-02-10 09:00:00',8000000),
('PN003','NCC003',6,'2025-03-01 07:30:00',12000000);

-- ChiTietNhapHang
INSERT INTO ChiTietNhapHang VALUES
('PN001','SP001',300,30000,'2025-06-30'),
('PN001','SP002',200,33000,'2025-06-30'),
('PN002','SP003',150,50000,'2025-06-30'),
('PN002','SP004',120,52000,'2025-06-30'),
('PN003','SP005', 80,80000,'2025-09-30'),
('PN003','SP006', 50,95000,'2025-09-30');

-- PhieuTraHang
INSERT INTO PhieuTraHang VALUES
('PT001','PN001',8,'2025-01-20',N'Hàng bị dập nát trong vận chuyển',500000),
('PT002','PN002',8,'2025-02-25',N'Hoa không đúng chủng loại đặt',800000);

-- ChiTietTraHang
INSERT INTO ChiTietTraHang VALUES
('PT001','SP001',10,30000),
('PT002','SP003',10,50000);
