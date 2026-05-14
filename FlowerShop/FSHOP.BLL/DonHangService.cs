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
            if (dh == null)
                return "Dữ liệu đơn hàng không hợp lệ";

            if (string.IsNullOrWhiteSpace(dh.MaKh))
                return "Tài khoản chưa liên kết khách hàng";

            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Danh sách sản phẩm không được rỗng";

            if (dh.ChiTietDonHangs.Any(x => x.SoLuong <= 0))
                return "Số lượng sản phẩm phải lớn hơn 0";

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

        public IEnumerable<DonHang> GetAllDonHang()
        {
            return _donHangRepo.GetDanhSach();
        }

        public DonHang GetById(string maDH)
        {
            return _donHangRepo.GetChiTiet(maDH);
        }

        public IEnumerable<DonHang> LocDonHang(string? maKH, int? maTrangThai, int? maPttt, string? maVoucher, DateTime? tuNgay, DateTime? denNgay, string? keyword)
        {
            return _donHangRepo.LocDonHang(maKH, maTrangThai, maPttt, maVoucher, tuNgay, denNgay, keyword);
        }

        public string CapNhatDonHang(string maDH, DonHang dh)
        {
            if (dh.ChiTietDonHangs == null || !dh.ChiTietDonHangs.Any())
                return "Danh sách sản phẩm không được rỗng";

            var merged = dh.ChiTietDonHangs
                .GroupBy(c => c.MaSp)
                .Select(g => new ChiTietDonHang
                {
                    MaDh = maDH,
                    MaSp = g.Key,
                    SoLuong = g.Sum(x => x.SoLuong),
                    DonGia = 0
                })
                .ToList();

            dh.ChiTietDonHangs = merged;

            return _donHangRepo.CapNhatDonHangBangEf(maDH, dh);
        }

        public string HuyDonHang(string maDH)
        {
            return _donHangRepo.HuyDonHangBangEf(maDH);
        }

        public string CapNhatTrangThai(string maDH, int maTrangThai)
        {
            var dh = _donHangRepo.GetById(maDH);

            if (dh == null)
                return "Không tìm thấy đơn hàng";

            if (dh.MaTrangThai == 4)
                return "Đơn hàng đã hủy, không thể cập nhật trạng thái";

            if (maTrangThai == 4)
                return HuyDonHang(maDH);

            try
            {
                dh.MaTrangThai = maTrangThai;

                _donHangRepo.Update(dh);
                _donHangRepo.Save();

                return "Cập nhật trạng thái thành công";
            }
            catch
            {
                return "Không thể cập nhật trạng thái đơn hàng";
            }
        }
    }
}
