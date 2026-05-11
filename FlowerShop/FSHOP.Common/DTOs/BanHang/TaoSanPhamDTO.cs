using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    public class TaoSanPhamDTO
    {
        public string MaSP { get; set; }
        public string TenSP { get; set; }
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; }
        public string? MaDM { get; set; }
    }
}
