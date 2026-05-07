using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class VwChiTietDonHang
{
    public string MaDh { get; set; } = null!;

    public DateTime? NgayDat { get; set; }

    public string TenKh { get; set; } = null!;

    public string? Sdt { get; set; }

    public string PhuongThucThanhToan { get; set; } = null!;

    public string? TenVoucher { get; set; }

    public string TenTrangThai { get; set; } = null!;

    public string TenSp { get; set; } = null!;

    public int SoLuong { get; set; }

    public decimal DonGia { get; set; }

    public decimal? ThanhTien { get; set; }

    public decimal TongTien { get; set; }
}
