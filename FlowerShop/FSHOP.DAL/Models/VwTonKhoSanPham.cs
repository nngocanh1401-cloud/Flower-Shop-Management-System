using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class VwTonKhoSanPham
{
    public string MaSp { get; set; } = null!;

    public string TenSp { get; set; } = null!;

    public string DanhMuc { get; set; } = null!;

    public decimal DonGia { get; set; }

    public int SoLuongTon { get; set; }

    public string TrangThaiTon { get; set; } = null!;
}
