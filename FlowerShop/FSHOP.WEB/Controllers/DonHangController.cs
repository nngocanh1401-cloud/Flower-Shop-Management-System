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

        // POST api/donhang
        [HttpPost]
        public IActionResult Create(TaoDonHangDTO dto)
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
        // PUT api/donhang/1/trangthai
        [HttpPut("{id}/trangthai")]
        public IActionResult UpdateTrangThai(string id, int matrangThai)
        {
            _service.CapNhatTrangThai(id, matrangThai);

            return Ok(new
            {
                message = "Cập nhật trạng thái thành công"
            });
        }

    }
}
