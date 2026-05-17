using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.Common.DTOs.BanHang
{
    public class LichSuMuaHangDTO
    {
        public string MaDH { get; set; } = string.Empty;

        public DateTime? NgayDat { get; set; }

        public decimal TongTien { get; set; }

        public string? TenTrangThai { get; set; }

        public int SoLoaiSP { get; set; }
    }
}
