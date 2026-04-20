using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface IKhachHangRepository : IGenericRepository<KhachHang>
    {
        KhachHang GetBySDT(string sdt);
    }
}
