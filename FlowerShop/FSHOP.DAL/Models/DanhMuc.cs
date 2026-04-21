using System;
using System.Collections.Generic;

namespace FSHOP.DAL.Models;

public partial class DanhMuc
{
    public string MaDm { get; set; } = null!;

    public string TenDm { get; set; } = null!;

    public string? Mota { get; set; }

    public string? MaDmcha { get; set; }

    public virtual ICollection<DanhMuc> InverseMaDmchaNavigation { get; set; } = new List<DanhMuc>();

    public virtual DanhMuc? MaDmchaNavigation { get; set; }

    public virtual ICollection<SanPham> SanPhams { get; set; } = new List<SanPham>();
}
