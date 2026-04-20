using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface IPhieuTraHangRepository : IGenericRepository<PhieuTraHang>
    {
        IEnumerable<PhieuTraHang> GetByPhieuNhap(string maPhieuNhap);
    }
}
