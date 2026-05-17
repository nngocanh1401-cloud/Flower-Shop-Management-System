using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class SanPham
{
    public string MaSp { get; set; } = null!;

    public string TenSp { get; set; } = null!;

    public decimal DonGia { get; set; }

    public int SoLuongTon { get; set; }

    public string? MaDm { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual ICollection<ChiTietNhapHang> ChiTietNhapHangs { get; set; } = new List<ChiTietNhapHang>();

    public virtual DanhMuc? MaDmNavigation { get; set; }
}
