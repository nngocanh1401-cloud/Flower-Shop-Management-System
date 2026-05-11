using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSHOP.DAL.Repositories;

namespace FSHOP.BLL
{
    public class DonHangService
    {
        private readonly IDonHangRepository _donHangRepo;

        public DonHangService(IDonHangRepository donHangRepo)
        {
            _donHangRepo = donHangRepo;
        }

        /// <summary>Gộp dòng trùng MaSP; tạo đơn bằng EF (tránh EXEC ThemDonHang + trigger lồng 32 tầng).</summary>
        public string TaoDonHang(DonHang dh)
        {
            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Danh sách sản phẩm không được rỗng";

            var merged = dh.ChiTietDonHangs
                .GroupBy(c => c.MaSp)
                .Select(g => new ChiTietDonHang
                {
                    MaDh = dh.MaDh,
                    MaSp = g.Key,
                    SoLuong = g.Sum(x => x.SoLuong),
                    DonGia = 0
                })
                .ToList();
            dh.ChiTietDonHangs = merged;

            return _donHangRepo.TaoDonHangBangEf(dh);
        }
        public string CapNhatTrangThai(string maDH, int maTrangThai)
        {
            var dh = _donHangRepo.GetById(maDH);

            if (dh == null)
                return "Không tìm thấy đơn hàng";

            dh.MaTrangThai = maTrangThai;

            _donHangRepo.Update(dh);

            _donHangRepo.Save();

            return "Cập nhật trạng thái thành công";
        }
    }
}
