using FSHOP.Common.DTOs.BanHang;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    public interface IDonHangRepository : IGenericRepository<DonHang>
    {
        string TaoDonHangBangEf(DonHang dh);
        string CapNhatDonHangBangEf(string maDH, DonHang dh);
        string HuyDonHangBangEf(string maDH);

        IEnumerable<DonHang> GetDanhSach();
        DonHang GetChiTiet(string maDH);
        IEnumerable<DonHang> GetByKhachHang(string maKH);
        IEnumerable<DonHang> GetByTrangThai(int maTrangThai);
        IEnumerable<DonHang> LocDonHang(string? maKH, int? maTrangThai, int? maPttt, string? maVoucher, DateTime? tuNgay, DateTime? denNgay, string? keyword);
        IEnumerable<LichSuMuaHangDTO> GetLichSuMuaHang(string maKH);
    }
}
