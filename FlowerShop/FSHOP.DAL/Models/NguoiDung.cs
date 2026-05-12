using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Models
{
    public class NguoiDung
    {
        public string MaNguoiDung { get; set; } = null!;
        public string TenDangNhap { get; set; } = null!;
        public string MatKhauHash { get; set; } = null!;
        public string? MaKh { get; set; }
        public int MaVaiTro { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;
        public virtual KhachHang? MaKhNavigation { get; set; }
    }
}
