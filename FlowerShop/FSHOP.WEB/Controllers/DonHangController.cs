using FSHOP.BLL;
using FSHOP.Common.DTO.BanHang;
using FSHOP.Common.DTOs;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonHangController : ControllerBase
    {
        private readonly DonHangService _service;

        public DonHangController(DonHangService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var result = _service.GetAllDonHang()
                .Select(MapDonHangDto)
                .ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
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
        public IActionResult Create([FromBody] TaoDonHangDTO dto)
        {
            var donHang = new DonHang
            {
                MaDh = dto.MaDH,

                MaKh = dto.MaKH,

                MaPttt = dto.MaPTTT,

                MaVoucher = string.IsNullOrWhiteSpace(dto.MaVoucher)
                ? null : dto.MaVoucher,

                MaTrangThai = 1,

                NgayDat = DateTime.Now,

                TongTien = 0,

                ChiTietDonHangs = dto.DanhSachChiTiet.Select(x => new ChiTietDonHang
                {
                    MaDh = dto.MaDH,
                    MaSp = x.MaSp,
                    SoLuong = x.SoLuong,
                    DonGia = 0
                }).ToList()
            };

            var result = _service.TaoDonHang(donHang);

            if (result == "Đặt hàng thành công")
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpPut("{id}")]
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
        public IActionResult Delete(string id)
        {
            var result = _service.HuyDonHang(id);

            if (result == "Hủy đơn hàng thành công")
                return Ok(new { message = result });

            if (result == "Không tìm thấy đơn hàng")
                return NotFound(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpGet("filter")]
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
