using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.DAL.Repositories
{
    public class SanPhamRepository : GenericRepository<SanPham>, ISanPhamRepository
    {
        public SanPhamRepository(FshopContext context) : base(context) { }

        public IEnumerable<SanPham> GetByDanhMuc(string maDM)
        {
            return _dbSet.Where(sp => sp.MaDm == maDM).ToList();
        }

        public SanPham GetByid(string id)
        {
            return _dbSet.FirstOrDefault(sp => sp.MaSp == id);
        }

        public IEnumerable<SanPham> TimKiem(string keyword)
        {
            return _dbSet.Where(sp => sp.TenSp.Contains(keyword)).ToList();
        }

        public string XoaSanPhamKemDuLieuLienQuan(string id)
        {
            var sanPham = _dbSet.FirstOrDefault(sp => sp.MaSp == id);

            if (sanPham == null)
                return "Không tìm thấy sản phẩm";

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var chiTietDonHangs = _context.ChiTietDonHangs
                    .Where(x => x.MaSp == id)
                    .ToList();

                var chiTietNhapHangs = _context.ChiTietNhapHangs
                    .Where(x => x.MaSp == id)
                    .ToList();

                var chiTietTraHangs = _context.ChiTietTraHangs
                    .Where(x => x.MaSp == id)
                    .ToList();

                if (chiTietDonHangs.Any())
                    _context.ChiTietDonHangs.RemoveRange(chiTietDonHangs);

                if (chiTietNhapHangs.Any())
                    _context.ChiTietNhapHangs.RemoveRange(chiTietNhapHangs);

                if (chiTietTraHangs.Any())
                    _context.ChiTietTraHangs.RemoveRange(chiTietTraHangs);

                _dbSet.Remove(sanPham);
                _context.SaveChanges();
                transaction.Commit();

                return "Xóa sản phẩm thành công";
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return $"Không thể xóa sản phẩm: {ex.GetBaseException().Message}";
            }
        }
    }
}