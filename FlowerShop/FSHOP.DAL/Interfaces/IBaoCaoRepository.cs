using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Repositories;

namespace FSHOP.DAL.Interfaces
{
    public interface IBaoCaoRepository : IGenericRepository<BaoCaoSanPham>
    {
        List<BaoCaoSanPham> GetBaoCao();
    }
}

