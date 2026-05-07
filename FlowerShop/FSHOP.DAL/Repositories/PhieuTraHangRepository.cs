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
    public class PhieuTraHangRepository : GenericRepository<PhieuTraHang>, IPhieuTraHangRepository
    {
        public PhieuTraHangRepository(FshopContext context) : base(context) { }

        public IEnumerable<PhieuTraHang> GetByPhieuNhap(string maPhieuNhap)
        {
            return _dbSet
                .Where(p => p.MaPhieuNhap == maPhieuNhap)
                .ToList();
        }

        //Su dung Stored Procedure
        public void ThemPhieuTraHang(string maPhieuTra, string maPhieuNhap,
                              string maTrangThai, string lyDo,
                              string maSP, int soLuong)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC ThemPhieuTraHang @MaPhieuTra, @MaPhieuNhap, @MaTrangThai, @LyDo, @MaSP, @SoLuong",
                new SqlParameter("@MaPhieuTra", maPhieuTra),
                new SqlParameter("@MaPhieuNhap", maPhieuNhap),
                new SqlParameter("@MaTrangThai", maTrangThai),
                new SqlParameter("@LyDo", lyDo),
                new SqlParameter("@MaSP", maSP),
                new SqlParameter("@SoLuong", soLuong)
            );
        }

        public void HuyPhieuTraHang(string maPhieuTra)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC HuyPhieuTraHang @MaPhieuTra",
                new SqlParameter("@MaPhieuTra", maPhieuTra)
            );
        }
    }
}
