using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.Common.DTOs.Kho
{
    public class CapNhatPhieuNhapDTO
    {
        public string MaNCC { get; set; } = string.Empty;

        public int MaTrangThai { get; set; }

        public DateTime? NgayNhap { get; set; }
    }
}
