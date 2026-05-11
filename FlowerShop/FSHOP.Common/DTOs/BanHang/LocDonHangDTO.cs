using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    public class LocDonHangDTO
    {
        public string? MaKH { get; set; }
        public int? MaTrangThai { get; set; }
        public int? MaPTTT { get; set; }
        public string? MaVoucher { get; set; }
        public DateTime? TuNgay { get; set; }
        public DateTime? DenNgay { get; set; }
        public string? Keyword { get; set; }
    }
}
