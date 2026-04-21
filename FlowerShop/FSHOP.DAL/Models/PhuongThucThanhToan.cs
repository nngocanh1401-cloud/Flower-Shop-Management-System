using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class PhuongThucThanhToan
{
    public int MaPttt { get; set; }

    public string TenPttt { get; set; } = null!;

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
}
