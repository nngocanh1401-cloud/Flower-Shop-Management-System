using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface IDonHangRepository : IGenericRepository<DonHang>
    {
        IEnumerable<DonHang> GetByKhachHang(string maKH);
        IEnumerable<DonHang> GetByTrangThai(int maTrangThai);
    }
}
