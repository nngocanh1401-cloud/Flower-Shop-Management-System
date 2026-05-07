using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Models
{
    public class BaoCaoSanPham
    {
        public int MaSp { get; set; }
        public string TenSp { get; set; } = string.Empty;
        public int SoLuongTon { get; set; }
        public decimal DonGia { get; set; }
    }
}
