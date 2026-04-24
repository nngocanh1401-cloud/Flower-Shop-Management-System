using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class ChiTietNhapHang
{
    public string MaPhieuNhap { get; set; } = null!;

    public string MaSp { get; set; } = null!;

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    public DateOnly? HanSuDung { get; set; }

    public virtual PhieuNhapHang MaPhieuNhapNavigation { get; set; } = null!;

    public virtual SanPham MaSpNavigation { get; set; } = null!;
}
