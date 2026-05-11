using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class VwTonKhoSanPham
{
    public string MaSp { get; set; } = string.Empty;

    public string TenSp { get; set; } = string.Empty;

    public string DanhMuc { get; set; } = string.Empty;

    public decimal DonGia { get; set; }

    public int SoLuongTon { get; set; }

    public string TrangThaiTon { get; set; } = string.Empty;
}
