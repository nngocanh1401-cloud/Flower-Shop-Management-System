using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    //Dùng khi khách bấm nút "Thanh Toán" gửi cục dữ liệu xuống
    public class TaoDonHangDTO
    {
        // Phần ghi vào bảng DonHang
        public int MaPTTT { get; set; }
        public string? MaVoucher { get; set; }

        // Phần ghi vào bảng ChiTietDonHang
        public List<ChiTietDonHangDTO> DanhSachChiTiet { get; set; } = new();
    }
}
