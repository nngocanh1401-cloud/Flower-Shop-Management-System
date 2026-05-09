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
    }
}
