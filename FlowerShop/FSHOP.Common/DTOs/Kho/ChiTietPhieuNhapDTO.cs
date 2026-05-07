using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    public class ChiTietPhieuNhapDTO
    {
        public string MaSP { get; set; }
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
        public DateTime? HanSuDung { get; set; }
    }
}
