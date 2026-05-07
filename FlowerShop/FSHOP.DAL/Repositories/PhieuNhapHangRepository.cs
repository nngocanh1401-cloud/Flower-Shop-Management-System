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
    public class PhieuNhapHangRepository : GenericRepository<PhieuNhapHang>, IPhieuNhapHangRepository
    {
        public PhieuNhapHangRepository(FshopContext context) : base(context) { }

        public IEnumerable<PhieuNhapHang> GetByNhaCungCap(string maNCC)
        {
            return _dbSet
                .Where(p => p.MaNcc == maNCC)
                .ToList();
        }

        public IEnumerable<PhieuNhapHang> GetByDateRange(DateTime tuNgay, DateTime denNgay)
        {
            return _dbSet
                .Where(p => p.NgayNhap >= tuNgay && p.NgayNhap <= denNgay)
                .ToList();
        }
        //Su dung Stored Procedure
        public void ThemPhieuNhap(string maPhieuNhap, string maNCC,
                           int maTrangThai, string maSP, int soLuong)
        {
            _context.Database.ExecuteSqlRaw(
                "EXEC ThemPhieuNhap @MaPhieuNhap, @MaNCC, @MaTrangThai, @MaSP, @SoLuong",
                new SqlParameter("@MaPhieuNhap", maPhieuNhap),
                new SqlParameter("@MaNCC", maNCC),
                new SqlParameter("@MaTrangThai", maTrangThai),
                new SqlParameter("@MaSP", maSP),
                new SqlParameter("@SoLuong", soLuong)
            );
        }
    }
}
