using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    public class DonHangDTO
    {
        public string MaDH { get; set; }
        public string TenKhachHang { get; set; }
        public string TenPTTT { get; set; }
        public string TenTrangThai { get; set; }
        public DateTime? NgayDat { get; set; }
        public decimal TongTien { get; set; }
    }
}
