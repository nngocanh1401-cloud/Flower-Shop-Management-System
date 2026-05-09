using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FSHOP.DAL.Models;

public partial class ChiTietDonHang
{
    public string MaDh { get; set; } = null!;

    public string MaSp { get; set; } = null!;

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    [JsonIgnore]
    public virtual DonHang MaDhNavigation { get; set; }

    [JsonIgnore]
    public virtual SanPham MaSpNavigation { get; set; }
}
