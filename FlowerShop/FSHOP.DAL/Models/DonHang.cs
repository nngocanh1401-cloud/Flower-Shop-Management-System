using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class DonHang
{
    public string MaDh { get; set; } = null!;

    public string MaKh { get; set; } = null!;

    public int MaPttt { get; set; }

    public string? MaVoucher { get; set; }

    public int MaTrangThai { get; set; }

    public DateTime? NgayDat { get; set; }

    public decimal TongTien { get; set; }

    public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();

    public virtual KhachHang MaKhNavigation { get; set; } = null!;

    public virtual PhuongThucThanhToan MaPtttNavigation { get; set; } = null!;

    public virtual TrangThai MaTrangThaiNavigation { get; set; } = null!;

    public virtual Voucher? MaVoucherNavigation { get; set; }
}
