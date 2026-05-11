using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using FSHOP.DAL.Repositories;

namespace FSHOP.DAL.Repositories
{
    public class BaoCaoRepository : GenericRepository<VwBaoCaoSanPham>, IBaoCaoRepository
    {
        public BaoCaoRepository(FshopContext context) : base(context)
        {
        }
        public List<VwBaoCaoSanPham> GetBaoCao()
        {
            return _context.VwBaoCaoSanPhams.ToList();
        }
        public List<VwTopSanPhamBanChay> GetTopBanChay()
        {
            // Gọi dữ liệu từ View tương ứng trong Database
            return _context.VwTopSanPhamBanChays.ToList();
        }

        public List<VwDoanhThuTheoThang> GetDoanhThu()
        {
            return _context.VwDoanhThuTheoThangs.ToList();
        }

        public List<VwTonKhoSanPham> GetTonKho()
        {
            return _context.VwTonKhoSanPhams.ToList();
        }
    }
}
