using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Repositories
{
    public class DonHangRepository : GenericRepository<DonHang>, IDonHangRepository
    {
        public DonHangRepository(FshopContext context) : base(context) { }

        public IEnumerable<DonHang> GetByKhachHang(string maKH)
        {
            return _dbSet
                .Where(dh => dh.MaKh == maKH)
                .Include(dh => dh.MaTrangThaiNavigation)
                .ToList();
        }

        public IEnumerable<DonHang> GetByTrangThai(int maTrangThai)
        {
            return _dbSet
                .Where(dh => dh.MaTrangThai == maTrangThai)
                .ToList();
        }

        public string TaoDonHangBangEf(DonHang dh)
        {
            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Đơn hàng phải có ít nhất một sản phẩm";

            decimal tienHang = 0;
            foreach (var ct in dh.ChiTietDonHangs)
            {
                var sp = _context.SanPhams.FirstOrDefault(x => x.MaSp == ct.MaSp);
                if (sp == null)
                    return $"Không tìm thấy sản phẩm {ct.MaSp}";
                if (sp.SoLuongTon < ct.SoLuong)
                    return $"Sản phẩm \"{sp.TenSp}\" không đủ tồn kho (còn {sp.SoLuongTon})";
                ct.DonGia = sp.DonGia;
                tienHang += ct.SoLuong * ct.DonGia;
            }

            decimal giamGia = 0;
            if (!string.IsNullOrWhiteSpace(dh.MaVoucher))
            {
                var v = _context.Vouchers.Find(dh.MaVoucher);
                var today = DateOnly.FromDateTime(DateTime.Today);
                if (v == null)
                    return "Mã voucher không tồn tại";
                if (today < v.NgayBd || today > v.NgayKt)
                    return $"Voucher hết hạn hoặc chưa có hiệu lực (áp dụng từ {v.NgayBd:dd/MM/yyyy} đến {v.NgayKt:dd/MM/yyyy}). Đổi NgayBD/NgayKT trong bảng Voucher nếu cần.";
                int conLai = v.SoLuong - (v.SoLuongDaDung ?? 0);
                if (conLai <= 0)
                    return "Voucher đã hết lượt sử dụng";
                decimal dieuKien = v.DieuKienApDung ?? 0;
                if (tienHang < dieuKien)
                    return $"Đơn chưa đủ điều kiện áp dụng voucher (tối thiểu {dieuKien:N0} đ)";

                if (string.Equals(v.LoaiGiam, "PERCENT", StringComparison.OrdinalIgnoreCase))
                    giamGia = tienHang * v.GiaTriGiam / 100;
                else
                    giamGia = v.GiaTriGiam;
            }

            dh.TongTien = tienHang - giamGia;
            if (dh.TongTien < 0)
                dh.TongTien = 0;
            dh.NgayDat ??= DateTime.Now;

            if (_context.DonHangs.Any(d => d.MaDh == dh.MaDh))
                return $"Mã đơn '{dh.MaDh}' đã tồn tại. Dùng mã đơn khác (MaDH).";

            if (!_context.KhachHangs.Any(k => k.MaKh == dh.MaKh))
                return $"Khách hàng '{dh.MaKh}' không có trong hệ thống. Kiểm tra MaKH hoặc thêm khách trước.";

            if (!_context.PhuongThucThanhToans.Any(p => p.MaPttt == dh.MaPttt))
                return $"Phương thức thanh toán (MaPTTT={dh.MaPttt}) không hợp lệ.";

            if (!_context.TrangThais.Any(t => t.MaTrangThai == dh.MaTrangThai))
                return $"Trạng thái đơn (MaTrangThai={dh.MaTrangThai}) không tồn tại.";

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                if (!string.IsNullOrWhiteSpace(dh.MaVoucher))
                {
                    var v = _context.Vouchers.Find(dh.MaVoucher);
                    if (v != null)
                        v.SoLuongDaDung = (v.SoLuongDaDung ?? 0) + 1;
                }

                _context.DonHangs.Add(dh);
                foreach (var ct in dh.ChiTietDonHangs)
                {
                    var sp = _context.SanPhams.First(x => x.MaSp == ct.MaSp);
                    sp.SoLuongTon -= ct.SoLuong;
                }

                _context.SaveChanges();
                transaction.Commit();
                return "Đặt hàng thành công";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Lỗi lưu đơn hàng: {FormatDbSaveError(ex)}";
            }
        }

        /// <summary>Lấy thông báo lỗi SQL (FK, trùng MaDH, …) từ InnerException.</summary>
        private static string FormatDbSaveError(Exception ex)
            => ex.GetBaseException().Message;

        public void HuyDonHang(string maDH)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC HuyDonHang @MaDH",
                new SqlParameter("@MaDH", maDH)
            );
        }
        public void CapNhatTrangThai(string maDH, int maTrangThai)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC CapNhatTrangThai @MaDH, @MaTrangThai",
                new SqlParameter("@MaDH", maDH),
                new SqlParameter("@MaTrangThai", maTrangThai)
            );
        }
    }
}
