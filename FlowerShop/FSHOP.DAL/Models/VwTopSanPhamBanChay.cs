using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class VwTopSanPhamBanChay
{
    public string MaSp { get; set; } = null!;

    public string TenSp { get; set; } = null!;

    public string DanhMuc { get; set; } = null!;

    public int? TongSoBan { get; set; }

    public decimal? TongDoanhThu { get; set; }
}
