using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class TrangThai
{
    public int MaTrangThai { get; set; }

    public string TenTrangThai { get; set; } = null!;

    public string? MoTa { get; set; }

    public string LoaiTrangThai { get; set; } = null!;

    public virtual ICollection<DonHang> DonHangs { get; set; } = new List<DonHang>();

    public virtual ICollection<PhieuNhapHang> PhieuNhapHangs { get; set; } = new List<PhieuNhapHang>();

    public virtual ICollection<PhieuTraHang> PhieuTraHangs { get; set; } = new List<PhieuTraHang>();
}
