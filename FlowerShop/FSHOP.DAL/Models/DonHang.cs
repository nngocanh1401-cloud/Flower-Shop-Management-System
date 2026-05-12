using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

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

    [ForeignKey("MaKh")]
    public virtual KhachHang MaKhNavigation { get; set; }

    [ForeignKey("MaTrangThai")]
    public virtual TrangThai MaTrangThaiNavigation { get; set; }

    [JsonIgnore]
    public virtual Voucher? MaVoucherNavigation { get; set; }

    [ForeignKey("MaPttt")]
    public virtual PhuongThucThanhToan MaPtttNavigation { get; set; }
}

