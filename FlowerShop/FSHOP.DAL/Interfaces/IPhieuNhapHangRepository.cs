using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface IPhieuNhapHangRepository : IGenericRepository<PhieuNhapHang>
    {
        IEnumerable<PhieuNhapHang> GetByDateRange(DateTime tuNgay, DateTime denNgay);
        IEnumerable<PhieuNhapHang> GetByNhaCungCap(string maNCC);
    }
}
