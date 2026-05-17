using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    public class PhieuNhapHangDTO
    {
        public string MaPhieuNhap { get; set; } = string.Empty;
        public string MaNCC { get; set; } = string.Empty;
        public string? TenNCC { get; set; }
        public int MaTrangThai { get; set; }
        public string? TenTrangThai { get; set; }
        public DateTime? NgayNhap { get; set; }
        public decimal TongTien { get; set; }

        public List<ChiTietPhieuNhapDTO> ChiTietNhapHangs { get; set; } = new();
    }
}
