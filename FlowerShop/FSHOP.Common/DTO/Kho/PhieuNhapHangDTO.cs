using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    //Dùng để xem danh sách phiếu nhập
    internal class PhieuNhapHangDTO
    {
        public string MaPhieuNhap { get; set; }
        public string TenNhaCungCap { get; set; }
        public string TenTrangThai { get; set; }
        public DateTime? NgayNhap { get; set; }
        public decimal TongTien { get; set; }
    }
}
