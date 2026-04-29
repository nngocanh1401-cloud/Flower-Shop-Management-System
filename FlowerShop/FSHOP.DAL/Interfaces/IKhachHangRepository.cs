using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IKhachHangRepository : IGenericRepository<KhachHang>
    {
        KhachHang GetBySDT(string sdt);
    }
}
