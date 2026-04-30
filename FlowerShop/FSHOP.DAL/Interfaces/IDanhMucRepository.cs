using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IDanhMucRepository : IGenericRepository<DanhMuc>
    {
        IEnumerable<DanhMuc> GetDanhMucCon(string maDMCha);
    }
}
