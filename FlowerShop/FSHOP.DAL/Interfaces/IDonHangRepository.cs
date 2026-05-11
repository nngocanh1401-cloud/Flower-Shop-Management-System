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
        string CapNhatDonHangBangEf(string maDH, DonHang dh);
        string HuyDonHangBangEf(string maDH);

        IEnumerable<DonHang> GetDanhSach();
        DonHang GetChiTiet(string maDH);
        IEnumerable<DonHang> GetByKhachHang(string maKH);
        IEnumerable<DonHang> GetByTrangThai(int maTrangThai);
        IEnumerable<DonHang> LocDonHang(string? maKH, int? maTrangThai, int? maPttt, string? maVoucher, DateTime? tuNgay, DateTime? denNgay, string? keyword);
    }
}
