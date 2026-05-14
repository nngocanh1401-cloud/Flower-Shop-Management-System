using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace FSHOP.Common.DTOs.HeThong
{
    public class LoginRequestDTO
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        public string TenDangNhap { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string MatKhau { get; set; } = string.Empty;
    }

    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public string TenDangNhap { get; set; } = string.Empty;
        public string? VaiTro { get; set; }
        public string? MaKH { get; set; } // Trả về để Client biết khách hàng nào đang đăng nhập
    }

    public class DangKyDTO
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        [StringLength(50, MinimumLength = 3)]
        public string TenDangNhap { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string MatKhau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên khách hàng không được để trống")]
        public string TenKH { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [RegularExpression(@"^0\d{9}$",
        ErrorMessage = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0")]
        public string SDT { get; set; } = string.Empty;

        public string? DiaChi { get; set; }
    }

    public class DoiMatKhauDTO
    {
        [Required]
        public string MatKhauCu { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string MatKhauMoi { get; set; } = string.Empty;
    }
}
