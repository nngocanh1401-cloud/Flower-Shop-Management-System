using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IDonHangRepository : IGenericRepository<DonHang>
    {
        /// <summary>Tạo đơn + chi tiết + trừ tồn + voucher trong một transaction (không gọi SP).</summary>
        string TaoDonHangBangEf(DonHang dh);

        IEnumerable<DonHang> GetByKhachHang(string maKH);
        IEnumerable<DonHang> GetByTrangThai(int maTrangThai);
    }
}
