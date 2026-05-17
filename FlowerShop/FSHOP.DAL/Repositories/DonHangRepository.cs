using FSHOP.Common.DTOs.BanHang;
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

        private IQueryable<DonHang> BuildDonHangQuery()
        {
            return _dbSet
                .Include(dh => dh.ChiTietDonHangs)
                    .ThenInclude(ct => ct.MaSpNavigation)
                .Include(dh => dh.MaKhNavigation)
                .Include(dh => dh.MaPtttNavigation)
                .Include(dh => dh.MaTrangThaiNavigation)
                .Include(dh => dh.MaVoucherNavigation);
        }

        public IEnumerable<DonHang> GetDanhSach()
        {
            return BuildDonHangQuery()
                .OrderByDescending(dh => dh.NgayDat)
                .ToList();
        }

        public DonHang GetChiTiet(string maDH)
        {
            return BuildDonHangQuery()
                .FirstOrDefault(dh => dh.MaDh == maDH);
        }

        public IEnumerable<DonHang> GetByKhachHang(string maKH)
        {
            return BuildDonHangQuery()
                .Where(dh => dh.MaKh == maKH)
                .ToList();
        }

        public IEnumerable<DonHang> GetByTrangThai(int maTrangThai)
        {
            return BuildDonHangQuery()
                .Where(dh => dh.MaTrangThai == maTrangThai)
                .ToList();
        }

        public IEnumerable<LichSuMuaHangDTO> GetLichSuMuaHang(string maKH)
        {
            var result = new List<LichSuMuaHangDTO>();

            using var conn = new SqlConnection(_context.Database.GetConnectionString());

            using var cmd = new SqlCommand(
                "SELECT * FROM dbo.fn_LichSuMuaHang(@MaKH)",
                conn
            );

            cmd.Parameters.AddWithValue("@MaKH", maKH);

            conn.Open();

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                result.Add(new LichSuMuaHangDTO
                {
                    MaDH = reader["MaDH"].ToString(),
                    NgayDat = reader["NgayDat"] as DateTime?,
                    TongTien = Convert.ToDecimal(reader["TongTien"]),
                    TenTrangThai = reader["TenTrangThai"].ToString(),
                    SoLoaiSP = Convert.ToInt32(reader["SoLoaiSP"])
                });
            }

            return result;
        }

        public IEnumerable<DonHang> LocDonHang(string? maKH, int? maTrangThai, int? maPttt, string? maVoucher, DateTime? tuNgay, DateTime? denNgay, string? keyword)
        {
            var query = BuildDonHangQuery().AsQueryable();

            if (!string.IsNullOrWhiteSpace(maKH))
                query = query.Where(dh => dh.MaKh == maKH);

            if (maTrangThai.HasValue)
                query = query.Where(dh => dh.MaTrangThai == maTrangThai.Value);

            if (maPttt.HasValue)
                query = query.Where(dh => dh.MaPttt == maPttt.Value);

            if (!string.IsNullOrWhiteSpace(maVoucher))
                query = query.Where(dh => dh.MaVoucher == maVoucher);

            if (tuNgay.HasValue)
            {
                var from = tuNgay.Value.Date;
                query = query.Where(dh => dh.NgayDat.HasValue && dh.NgayDat.Value.Date >= from);
            }

            if (denNgay.HasValue)
            {
                var to = denNgay.Value.Date;
                query = query.Where(dh => dh.NgayDat.HasValue && dh.NgayDat.Value.Date <= to);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(dh => dh.MaDh.Contains(keyword));

            return query
                .OrderByDescending(dh => dh.NgayDat)
                .ToList();
        }

        public string TaoDonHangBangEf(DonHang dh)
        {
            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Đơn hàng phải có ít nhất một sản phẩm";

            if (string.IsNullOrWhiteSpace(dh.MaKh))
                return "Tài khoản chưa liên kết khách hàng";

            if (_context.DonHangs.Any(d => d.MaDh == dh.MaDh))
                return $"Mã đơn '{dh.MaDh}' đã tồn tại";

            if (!_context.KhachHangs.Any(k => k.MaKh == dh.MaKh))
                return "Tài khoản chưa liên kết khách hàng";

            if (!_context.PhuongThucThanhToans.Any(p => p.MaPttt == dh.MaPttt))
                return $"Phương thức thanh toán (MaPTTT={dh.MaPttt}) không hợp lệ.";

            if (!_context.TrangThais.Any(t => t.MaTrangThai == dh.MaTrangThai))
                return $"Trạng thái đơn (MaTrangThai={dh.MaTrangThai}) không tồn tại.";

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                decimal tienHang = 0;

                foreach (var ct in dh.ChiTietDonHangs)
                {
                    var sp = _context.SanPhams.FirstOrDefault(x => x.MaSp == ct.MaSp);

                    if (sp == null)
                    {
                        transaction.Rollback();
                        return $"Không tìm thấy sản phẩm {ct.MaSp}";
                    }

                    if (ct.SoLuong <= 0)
                    {
                        transaction.Rollback();
                        return "Số lượng sản phẩm phải lớn hơn 0";
                    }

                    if (sp.SoLuongTon < ct.SoLuong)
                    {
                        transaction.Rollback();
                        return $"Sản phẩm {sp.TenSp} không đủ tồn kho còn {sp.SoLuongTon}";
                    }

                    ct.DonGia = sp.DonGia;
                    tienHang += ct.SoLuong * ct.DonGia;
                }

                decimal giamGia = 0;

                if (!string.IsNullOrWhiteSpace(dh.MaVoucher))
                {
                    var v = _context.Vouchers.Find(dh.MaVoucher);
                    var today = DateOnly.FromDateTime(DateTime.Today);

                    if (v == null)
                    {
                        transaction.Rollback();
                        return "Mã voucher không tồn tại";
                    }

                    if (today < v.NgayBd || today > v.NgayKt)
                    {
                        transaction.Rollback();
                        return $"Voucher hết hạn hoặc chưa có hiệu lực (áp dụng từ {v.NgayBd:dd/MM/yyyy} đến {v.NgayKt:dd/MM/yyyy}).";
                    }

                    int conLai = v.SoLuong - (v.SoLuongDaDung ?? 0);
                    if (conLai <= 0)
                    {
                        transaction.Rollback();
                        return "Voucher đã hết lượt sử dụng";
                    }

                    decimal dieuKien = v.DieuKienApDung ?? 0;
                    if (tienHang < dieuKien)
                    {
                        transaction.Rollback();
                        return $"Đơn chưa đủ điều kiện áp dụng voucher (tối thiểu {dieuKien:N0} đ)";
                    }

                    if (string.Equals(v.LoaiGiam, "PERCENT", StringComparison.OrdinalIgnoreCase))
                        giamGia = tienHang * v.GiaTriGiam / 100;
                    else
                        giamGia = v.GiaTriGiam;

                    v.SoLuongDaDung = (v.SoLuongDaDung ?? 0) + 1;
                }

                dh.TongTien = tienHang - giamGia;
                if (dh.TongTien < 0)
                    dh.TongTien = 0;

                dh.NgayDat ??= DateTime.Now;

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

        public string CapNhatDonHangBangEf(string maDH, DonHang dh)
        {
            var donHangHienTai = _context.DonHangs
                .Include(x => x.ChiTietDonHangs)
                .FirstOrDefault(x => x.MaDh == maDH);

            if (donHangHienTai == null)
                return "Không tìm thấy đơn hàng";

            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Danh sách sản phẩm không được rỗng";

            if (!_context.KhachHangs.Any(k => k.MaKh == dh.MaKh))
                return $"Khách hàng '{dh.MaKh}' không có trong hệ thống.";

            if (!_context.PhuongThucThanhToans.Any(p => p.MaPttt == dh.MaPttt))
                return $"Phương thức thanh toán (MaPTTT={dh.MaPttt}) không hợp lệ.";

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                foreach (var chiTietCu in donHangHienTai.ChiTietDonHangs)
                {
                    var sanPhamCu = _context.SanPhams.FirstOrDefault(sp => sp.MaSp == chiTietCu.MaSp);
                    if (sanPhamCu != null)
                        sanPhamCu.SoLuongTon += chiTietCu.SoLuong;
                }

                _context.ChiTietDonHangs.RemoveRange(donHangHienTai.ChiTietDonHangs);
                _context.SaveChanges();

                var merged = dh.ChiTietDonHangs
                    .GroupBy(c => c.MaSp)
                    .Select(g => new ChiTietDonHang
                    {
                        MaDh = donHangHienTai.MaDh,
                        MaSp = g.Key,
                        SoLuong = g.Sum(x => x.SoLuong),
                        DonGia = 0
                    })
                    .ToList();

                decimal tienHang = 0;
                foreach (var ct in merged)
                {
                    var sp = _context.SanPhams.FirstOrDefault(x => x.MaSp == ct.MaSp);
                    if (sp == null)
                    {
                        transaction.Rollback();
                        return $"Không tìm thấy sản phẩm {ct.MaSp}";
                    }

                    if (sp.SoLuongTon < ct.SoLuong)
                    {
                        transaction.Rollback();
                        return $"Sản phẩm \"{sp.TenSp}\" không đủ tồn kho (còn {sp.SoLuongTon})";
                    }

                    ct.DonGia = sp.DonGia;
                    tienHang += ct.SoLuong * ct.DonGia;
                    sp.SoLuongTon -= ct.SoLuong;
                }

                var maVoucherMoi = string.IsNullOrWhiteSpace(dh.MaVoucher) ? null : dh.MaVoucher;
                decimal giamGia = 0;
                if (!string.IsNullOrWhiteSpace(maVoucherMoi))
                {
                    var voucher = _context.Vouchers.Find(maVoucherMoi);
                    var today = DateOnly.FromDateTime(DateTime.Today);

                    if (voucher == null)
                    {
                        transaction.Rollback();
                        return "Mã voucher không tồn tại";
                    }

                    if (today < voucher.NgayBd || today > voucher.NgayKt)
                    {
                        transaction.Rollback();
                        return $"Voucher hết hạn hoặc chưa có hiệu lực (áp dụng từ {voucher.NgayBd:dd/MM/yyyy} đến {voucher.NgayKt:dd/MM/yyyy}).";
                    }

                    var soLuongDaDung = voucher.SoLuongDaDung ?? 0;
                    var soLuongConLai = voucher.SoLuong - soLuongDaDung;
                    var dangDoiVoucher = !string.Equals(donHangHienTai.MaVoucher, maVoucherMoi, StringComparison.OrdinalIgnoreCase);

                    if (dangDoiVoucher && soLuongConLai <= 0)
                    {
                        transaction.Rollback();
                        return "Voucher đã hết lượt sử dụng";
                    }

                    decimal dieuKien = voucher.DieuKienApDung ?? 0;
                    if (tienHang < dieuKien)
                    {
                        transaction.Rollback();
                        return $"Đơn chưa đủ điều kiện áp dụng voucher (tối thiểu {dieuKien:N0} đ)";
                    }

                    if (string.Equals(voucher.LoaiGiam, "PERCENT", StringComparison.OrdinalIgnoreCase))
                        giamGia = tienHang * voucher.GiaTriGiam / 100;
                    else
                        giamGia = voucher.GiaTriGiam;
                }

                if (!string.IsNullOrWhiteSpace(donHangHienTai.MaVoucher)
                    && !string.Equals(donHangHienTai.MaVoucher, maVoucherMoi, StringComparison.OrdinalIgnoreCase))
                {
                    var voucherCu = _context.Vouchers.Find(donHangHienTai.MaVoucher);
                    if (voucherCu != null && (voucherCu.SoLuongDaDung ?? 0) > 0)
                        voucherCu.SoLuongDaDung = (voucherCu.SoLuongDaDung ?? 0) - 1;
                }

                if (!string.IsNullOrWhiteSpace(maVoucherMoi)
                    && !string.Equals(donHangHienTai.MaVoucher, maVoucherMoi, StringComparison.OrdinalIgnoreCase))
                {
                    var voucherMoi = _context.Vouchers.Find(maVoucherMoi);
                    if (voucherMoi != null)
                        voucherMoi.SoLuongDaDung = (voucherMoi.SoLuongDaDung ?? 0) + 1;
                }

                donHangHienTai.MaKh = dh.MaKh;
                donHangHienTai.MaPttt = dh.MaPttt;
                donHangHienTai.MaVoucher = maVoucherMoi;
                donHangHienTai.TongTien = tienHang - giamGia;
                if (donHangHienTai.TongTien < 0)
                    donHangHienTai.TongTien = 0;

                _context.ChiTietDonHangs.AddRange(merged);
                _context.SaveChanges();
                transaction.Commit();

                return "Cập nhật đơn hàng thành công";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Lỗi cập nhật đơn hàng: {FormatDbSaveError(ex)}";
            }
        }
        private static string FormatDbSaveError(Exception ex)
            => ex.GetBaseException().Message;

        public string HuyDonHangBangEf(string maDH)
        {
            var dh = _context.DonHangs
                .Include(x => x.ChiTietDonHangs)
                .FirstOrDefault(x => x.MaDh == maDH);

            if (dh == null)
                return "Không tìm thấy đơn hàng";

            if (dh.MaTrangThai == 4)
                return "Đơn hàng đã hủy trước đó";

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                foreach (var ct in dh.ChiTietDonHangs)
                {
                    var sp = _context.SanPhams.FirstOrDefault(x => x.MaSp == ct.MaSp);
                    if (sp != null)
                        sp.SoLuongTon += ct.SoLuong;
                }

                dh.MaTrangThai = 4;

                _context.SaveChanges();
                transaction.Commit();

                return "Hủy đơn hàng thành công";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Không thể hủy đơn hàng: {ex.GetBaseException().Message}";
            }
        }
    }
}