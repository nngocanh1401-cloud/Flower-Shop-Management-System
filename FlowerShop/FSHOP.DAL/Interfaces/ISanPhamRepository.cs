using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface ISanPhamRepository : IGenericRepository<SanPham>
    {
        IEnumerable<SanPham> GetByid(string id);
        IEnumerable<SanPham> TimKiem(string keyword);

    }
}
