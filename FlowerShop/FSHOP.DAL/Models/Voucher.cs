using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class Voucher
{
    public string MaVoucher { get; set; } = null!;

    public string? TenVoucher { get; set; }

    public DateOnly NgayBd { get; set; }

    public DateOnly NgayKt { get; set; }

    public decimal GiaTriGiam { get; set; }

    public string LoaiGiam { get; set; } = null!;

    public decimal? DieuKienApDung { get; set; }

    public int SoLuong { get; set; }

    public int? SoLuongDaDung { get; set; }

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();
}
