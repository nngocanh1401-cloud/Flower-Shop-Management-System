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
        public IEnumerable<PhieuNhapHang> GetDanhSach()
        {
            return _context.PhieuNhapHangs
                .Include(p => p.ChiTietNhapHangs)
                    .ThenInclude(ct => ct.MaSpNavigation)
                .Include(p => p.MaNccNavigation)
                .Include(p => p.MaTrangThaiNavigation)
                .OrderByDescending(p => p.NgayNhap)
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
            try
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
            catch (Exception ex)
            {
                throw new Exception(ex.GetBaseException().Message);
            }

        }
        public void XoaPhieuNhapKemChiTiet(string maPhieuNhap)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var chiTiet = _context.ChiTietNhapHangs
                    .Where(x => x.MaPhieuNhap == maPhieuNhap)
                    .ToList();

                _context.ChiTietNhapHangs.RemoveRange(chiTiet);

                var phieuNhap = _context.PhieuNhapHangs
                    .FirstOrDefault(x => x.MaPhieuNhap == maPhieuNhap);

                if (phieuNhap != null)
                    _context.PhieuNhapHangs.Remove(phieuNhap);

                _context.SaveChanges();
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}

