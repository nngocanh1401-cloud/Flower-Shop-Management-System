using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface INhaCungCapRepository : IGenericRepository<NhaCungCap>
    {
        IEnumerable<NhaCungCap> SearchByName(string tenNCC);
        NhaCungCap GetByMaSoThue(string maSoThue);
    }
}
