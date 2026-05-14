using FSHOP.Common.DTO.Kho;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IPhieuNhapHangRepository : IGenericRepository<PhieuNhapHang>
    {
        IEnumerable<PhieuNhapHang> GetByNhaCungCap(string maNCC);
        IEnumerable<PhieuNhapHang> GetByDateRange(DateTime tuNgay, DateTime denNgay);

        void ThemPhieuNhap(string maPhieuNhap, string maNCC, int maTrangThai, string maSP, int soLuong);
        void XoaPhieuNhapKemChiTiet(string maPhieuNhap);
    }
}
