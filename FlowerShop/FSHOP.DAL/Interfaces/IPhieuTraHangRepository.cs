using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IPhieuTraHangRepository : IGenericRepository<PhieuTraHang>
    {
        IEnumerable<PhieuTraHang> GetByPhieuNhap(string maPhieuNhap);
    }
}
