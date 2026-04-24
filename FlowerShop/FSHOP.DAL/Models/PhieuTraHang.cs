using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class PhieuTraHang
{
    public string MaPhieuTra { get; set; } = null!;

    public string MaPhieuNhap { get; set; } = null!;

    public int MaTrangThai { get; set; }

    public DateOnly? NgayTra { get; set; }

    public string? LyDo { get; set; }

    public decimal? TongTienTra { get; set; }

    public virtual ICollection<ChiTietTraHang> ChiTietTraHangs { get; set; } = new List<ChiTietTraHang>();

    public virtual PhieuNhapHang MaPhieuNhapNavigation { get; set; } = null!;

    public virtual TrangThai MaTrangThaiNavigation { get; set; } = null!;
}
