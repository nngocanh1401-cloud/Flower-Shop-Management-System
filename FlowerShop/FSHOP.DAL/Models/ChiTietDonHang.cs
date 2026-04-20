using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class ChiTietDonHang
{
    public string MaDh { get; set; } = null!;

    public string MaSp { get; set; } = null!;

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    public virtual DonHang MaDhNavigation { get; set; } = null!;

    public virtual SanPham MaSpNavigation { get; set; } = null!;
}
