using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    //Dùng để hiển thị lên lưới sản phẩm
    internal class SanPhamDTO
    {
        public string MaSP { get; set; }
        public string TenSP { get; set; }
        public decimal DonGia { get; set; }
        public int SoLuongTon { get; set; }
        public string TenDanhMuc { get; set; }
    }
}
