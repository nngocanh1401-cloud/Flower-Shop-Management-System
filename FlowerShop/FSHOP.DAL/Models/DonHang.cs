using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

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

    [JsonIgnore]
    public virtual PhuongThucThanhToan MaPtttNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual KhachHang MaKHNavigation { get; set; }

    //    Hướng A: Nếu bạn muốn lưu mã trạng thái(ví dụ: "01", "02")
    //Thông thường trong bảng DonHang sẽ có một cột khóa ngoại là MaTrangThai.Bạn hãy kiểm tra xem trong file DonHang.cs có thuộc tính nào tên là MaTrangThai không.Nếu có, hãy sửa code ở DonHangService.cs thành:

    //C#
    //dh.MaTrangThai = trangThai; // trangThai truyền vào phải là mã (ID)
    //    Hướng B: Nếu bạn muốn gán trực tiếp vào đối tượng điều hướng
    //    Nếu bạn muốn truy cập vào thuộc tính tên của trạng thái bên trong bảng liên kết, bạn phải gọi thông qua biến Navigation:

    //C#
    //// Lưu ý: Cách này thường dùng để hiển thị, không dùng để cập nhật trực tiếp tên trạng thái vào bảng DonHang
    //dh.MaTrangThaiNavigation.TenTrangThai = trangThai;

    [JsonIgnore]
    public virtual Voucher? MaVoucherNavigation { get; set; }

    [JsonIgnore]
    public virtual TrangThai MaTrangThaiNavigation { get; set; }
}

