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
        private readonly ISanPhamRepository _sanPhamRepo;
        private readonly IDonHangRepository _donHangRepo;

        public DonHangService(
            ISanPhamRepository sanPhamRepo,
            IDonHangRepository donHangRepo
            )
        {
            _sanPhamRepo = sanPhamRepo;
            _donHangRepo = donHangRepo;

        }
        public string TaoDonHang(DonHang dh)
        {
            // 1. KIỂM TRA TỒN KHO TRƯỚC CHO TẤT CẢ SẢN PHẨM
            foreach (var ct in dh.ChiTietDonHangs)
            {
                var sp = _sanPhamRepo.GetById(ct.MaSp);
                if (sp == null)
                    return $"Sản phẩm mã {ct.MaSp} không tồn tại";

                if (sp.SoLuongTon < ct.SoLuong)
                    return $"Sản phẩm {sp.TenSp} không đủ tồn kho";
            }

            // 2. NẾU TẤT CẢ ĐỀU ĐỦ HÀNG -> TIẾN HÀNH TRỪ KHO VÀ LƯU
            foreach (var ct in dh.ChiTietDonHangs)
            {
                var sp = _sanPhamRepo.GetById(ct.MaSp);

                // Cập nhật số lượng tồn
                sp.SoLuongTon -= ct.SoLuong;
                _sanPhamRepo.Update(sp);
            }

            // 3. LƯU ĐƠN HÀNG CHÍNH (HEADER)
            _donHangRepo.Add(dh);

            return "Đặt hàng thành công";
        }
        public string CapNhatTrangThai(int maDH, string trangThai)
        {
            var dh = _donHangRepo.GetById(maDH);

            if (dh == null)
                return "Không tìm thấy đơn hàng";

            dh.MaTrangThaiNavigation.TenTrangThai = trangThai;

            _donHangRepo.Update(dh);

            return "Cập nhật trạng thái thành công";
        }
    }
}
