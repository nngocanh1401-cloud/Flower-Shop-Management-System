using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Models
{
    public class VaiTro
    {
        public int MaVaiTro { get; set; }
        public string TenVaiTro { get; set; } = string.Empty;

        // Quan hệ ngược lại: Một vai trò có nhiều người dùng
        public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();
    }
}
