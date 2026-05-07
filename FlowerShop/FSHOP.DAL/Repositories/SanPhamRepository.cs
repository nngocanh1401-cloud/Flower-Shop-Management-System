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

        public IEnumerable<SanPham> TimKiem(string keyword)
        {
            return _dbSet.Where(sp => sp.TenSp.Contains(keyword)).ToList();
        }
    }
}