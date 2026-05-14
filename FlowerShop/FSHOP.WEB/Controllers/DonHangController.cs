using FSHOP.BLL;
using FSHOP.Common.DTO.BanHang;
using FSHOP.Common.DTOs;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DonHangController : ControllerBase
    {
        private readonly DonHangService _service;

        public DonHangController(DonHangService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // <--- CHỈ ADMIN mới được xem tất cả đơn hàng
        public IActionResult GetAll()
        {
            var result = _service.GetAllDonHang()
                .Select(MapDonHangDto)
                .ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,KhachHang")] // Cả 2 đều vào được, nhưng phải kiểm tra đơn hàng đó có đúng của khách hàng đang đăng nhập không. Nếu không, khách hàng A có thể xem đơn hàng của khách hàng B.
        public IActionResult GetById(string id)
        {
            var result = _service.GetById(id);

            if (result == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            return Ok(new
            {
                maDH = result.MaDh,
                maKH = result.MaKh,
                tenKhachHang = result.MaKhNavigation?.TenKh,
                maPTTT = result.MaPttt,
                tenPTTT = result.MaPtttNavigation?.TenPttt,
                maVoucher = result.MaVoucher,
                tenVoucher = result.MaVoucherNavigation?.TenVoucher,
                maTrangThai = result.MaTrangThai,
                tenTrangThai = result.MaTrangThaiNavigation?.TenTrangThai,
                ngayDat = result.NgayDat,
                tongTien = result.TongTien,
                chiTiet = result.ChiTietDonHangs.Select(x => new
                {
                    maSP = x.MaSp,
                    tenSP = x.MaSpNavigation?.TenSp,
                    soLuong = x.SoLuong,
                    donGia = x.DonGia,
                    thanhTien = x.SoLuong * x.DonGia
                }).ToList()
            });
        }
        // POST api/donhang
        [HttpPost]
        [Authorize(Roles = "KhachHang")] // Chỉ Khachhang mới được đặt hàng
        public IActionResult Create([FromBody] TaoDonHangDTO dto)
        {
            var maKH = User.FindFirst("MaKH")?.Value;

            if (string.IsNullOrWhiteSpace(maKH))
                return Unauthorized(new { message = "Tài khoản chưa liên kết khách hàng" });

            var maDH = "DH" + DateTime.Now.ToString("MMddHHmm");


            var donHang = new DonHang
            {
                MaDh = maDH,

                MaKh = maKH,

                MaPttt = dto.MaPTTT,

                MaVoucher = string.IsNullOrWhiteSpace(dto.MaVoucher)
                ? null : dto.MaVoucher,

                MaTrangThai = 1,

                NgayDat = DateTime.Now,

                TongTien = 0,

                ChiTietDonHangs = dto.DanhSachChiTiet.Select(x => new ChiTietDonHang
                {
                    MaDh = maDH,
                    MaSp = x.MaSp,
                    SoLuong = x.SoLuong,
                    DonGia = 0
                }).ToList()
            };

            var result = _service.TaoDonHang(donHang);

            if (result == "Đặt hàng thành công")
                return Ok(new { message = result, maDH = maDH });

            return BadRequest(new { message = result });
        }

        private string TaoMaDonHang()
        {
            return "DH" + DateTime.Now.ToString("MMddHHmm");
        }

        // POST api/donhang/admin
        [HttpPost("admin")]
        [Authorize(Roles = "Admin")] // admin tao don cho KH khi khach hang dat don qua DT/offline
        public IActionResult TaoDonHangAdmin([FromBody] TaoDonHangAdminDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.MaKH))
                return BadRequest(new { message = "Vui lòng chọn khách hàng" });

            var maDH = TaoMaDonHang();

            var donHang = new DonHang
            {
                MaDh = maDH,
                MaKh = dto.MaKH,
                MaPttt = dto.MaPTTT,
                MaVoucher = string.IsNullOrWhiteSpace(dto.MaVoucher) ? null : dto.MaVoucher,
                MaTrangThai = 1,
                NgayDat = DateTime.Now,
                TongTien = 0,
                ChiTietDonHangs = dto.DanhSachChiTiet.Select(x => new ChiTietDonHang
                {
                    MaDh = maDH,
                    MaSp = x.MaSp,
                    SoLuong = x.SoLuong,
                    DonGia = 0
                }).ToList()
            };

            var result = _service.TaoDonHang(donHang);

            if (result == "Đặt hàng thành công")
                return Ok(new { message = result, maDH });

            return BadRequest(new { message = result });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // chỉ admin sửa đơn hàng, khách hàng được sửa đơn khi đơn chưa xử lý thì cần kiểm tra thêm trong service.
        public IActionResult Update(string id, [FromBody] CapNhatDonHangDTO dto)
        {
            var donHang = new DonHang
            {
                MaDh = id,
                MaKh = dto.MaKH,
                MaPttt = dto.MaPTTT,
                MaVoucher = string.IsNullOrWhiteSpace(dto.MaVoucher) ? null : dto.MaVoucher,
                ChiTietDonHangs = dto.DanhSachChiTiet.Select(x => new ChiTietDonHang
                {
                    MaDh = id,
                    MaSp = x.MaSp,
                    SoLuong = x.SoLuong,
                    DonGia = 0
                }).ToList()
            };

            var result = _service.CapNhatDonHang(id, donHang);

            if (result == "Cập nhật đơn hàng thành công")
                return Ok(new { message = result });

            if (result == "Không tìm thấy đơn hàng")
                return NotFound(new { message = result });

            return BadRequest(new { message = result });
        }

        // PUT api/donhang/1/trangthai
        [HttpPut("{id}/trangthai")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateTrangThai(string id, int matrangThai)
        {
            var result = _service.CapNhatTrangThai(id, matrangThai);

            if (result == "Cập nhật trạng thái thành công")
                return Ok(new { message = result });

            if (result == "Không tìm thấy đơn hàng")
                return NotFound(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới có quyền xóa/hủy đơn hàng của hệ thống
        public IActionResult Delete(string id)
        {
            var result = _service.HuyDonHang(id);

            if (result == "Hủy đơn hàng thành công")
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpGet("filter")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới có quyền lọc đơn hàng của hệ thống
        public IActionResult Filter([FromQuery] LocDonHangDTO filter)
        {
            var result = _service.LocDonHang(
                    filter.MaKH,
                    filter.MaTrangThai,
                    filter.MaPTTT,
                    string.IsNullOrWhiteSpace(filter.MaVoucher) ? null : filter.MaVoucher,
                    filter.TuNgay,
                    filter.DenNgay,
                    string.IsNullOrWhiteSpace(filter.Keyword) ? null : filter.Keyword)
                .Select(MapDonHangDto)
                .ToList();

            return Ok(result);
        }

        private static DonHangDTO MapDonHangDto(DonHang donHang)
        {
            return new DonHangDTO
            {
                MaDH = donHang.MaDh,
                TenKhachHang = donHang.MaKhNavigation?.TenKh ?? donHang.MaKh,
                TenPTTT = donHang.MaPtttNavigation?.TenPttt ?? donHang.MaPttt.ToString(),
                TenTrangThai = donHang.MaTrangThaiNavigation?.TenTrangThai ?? donHang.MaTrangThai.ToString(),
                NgayDat = donHang.NgayDat,
                TongTien = donHang.TongTien
            };
        }

    }
}
