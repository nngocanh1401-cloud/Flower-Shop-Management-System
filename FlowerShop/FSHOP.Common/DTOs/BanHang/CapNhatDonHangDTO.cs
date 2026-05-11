using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    public class CapNhatDonHangDTO
    {
        public string MaKH { get; set; }
        public int MaPTTT { get; set; }
        public string? MaVoucher { get; set; }
        public List<ChiTietDonHangDTO> DanhSachChiTiet { get; set; }
    }
}
