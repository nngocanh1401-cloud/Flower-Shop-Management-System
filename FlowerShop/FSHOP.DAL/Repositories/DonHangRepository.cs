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

        public bool TaoDonHang(string maDH, string maKH, int maPTTT, string maVoucher)
        {
            var parameters = new[]
            {
            new SqlParameter("@MaDH", maDH),
            new SqlParameter("@MaKH", maKH),
            new SqlParameter("@MaPTTT", maPTTT),
            new SqlParameter("@MaVoucher", (object)maVoucher ?? DBNull.Value)
        };

            _context.Database.ExecuteSqlRaw(
                "EXEC sp_ThemDonHang @MaDH, @MaKH, @MaPTTT, @MaVoucher",
                parameters
            );
            return true;
        }

        ////Su dung Stored Procedure
        public void ThemDonHang(string maDH, string maKH, int maPTTT,
                         string? maVoucher, int maTrangThai,
                         string maSP, int soLuong)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC ThemDonHang @MaDH, @MaKH, @MaPTTT, @MaVoucher, @MaTrangThai, @MaSP, @SoLuong",
                new SqlParameter("@MaDH", maDH),
                new SqlParameter("@MaKH", maKH),
                new SqlParameter("@MaPTTT", maPTTT),
                new SqlParameter("@MaVoucher", (object?)maVoucher ?? DBNull.Value),
                new SqlParameter("@MaTrangThai", maTrangThai),
                new SqlParameter("@MaSP", maSP),
                new SqlParameter("@SoLuong", soLuong)
            );
        }
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
