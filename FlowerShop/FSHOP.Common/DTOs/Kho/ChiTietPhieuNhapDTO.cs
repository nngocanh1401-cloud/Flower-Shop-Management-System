using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    public class ChiTietPhieuNhapDTO
    {
        public string MaSP { get; set; } = string.Empty;
        public string? TenSP { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public decimal ThanhTien { get; set; }
    }
}
