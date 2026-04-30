using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface INhaCungCapRepository : IGenericRepository<NhaCungCap>
    {
        IEnumerable<NhaCungCap> SearchByName(string tenNCC);
        NhaCungCap GetByMaSoThue(string maSoThue);
    }
}
