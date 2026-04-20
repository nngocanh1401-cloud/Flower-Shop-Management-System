using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface ISanPhamRepository : IGenericRepository<SanPham>
    {
        IEnumerable<SanPham> GetByDanhMuc(string maDM);
        IEnumerable<SanPham> TimKiem(string keyword);
    }
}
