using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class PhieuNhapHang
{
    public string MaPhieuNhap { get; set; } = null!;

    public string MaNcc { get; set; } = null!;

    public int MaTrangThai { get; set; }

    public DateTime? NgayNhap { get; set; }

    public decimal TongTien { get; set; }

    public virtual ICollection<ChiTietNhapHang> ChiTietNhapHangs { get; set; } = new List<ChiTietNhapHang>();

    public virtual NhaCungCap MaNccNavigation { get; set; } = null!;

    public virtual TrangThai MaTrangThaiNavigation { get; set; } = null!;

    public virtual ICollection<PhieuTraHang> PhieuTraHangs { get; set; } = new List<PhieuTraHang>();
}
