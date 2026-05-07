using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.DAL.Repositories
{
    public class SanPhamRepository: GenericRepository<SanPham>, ISanPhamRepository
    {
        
        public SanPhamRepository(FshopContext context) : base(context)
        {
        }

        public IEnumerable<SanPham> GetByDanhMuc(string MaDm)
        {
            return _context.SanPhams
                .Where(x => x.MaDm == MaDm)
                .ToList();
        }

        public IEnumerable<SanPham> TimKiem(string keyword)
        {
            return _context.SanPhams
                .Where(x => x.TenSp.Contains(keyword))
                .ToList();
        }
    }
}

