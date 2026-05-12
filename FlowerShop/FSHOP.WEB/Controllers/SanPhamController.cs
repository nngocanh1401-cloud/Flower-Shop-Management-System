using FSHOP.BLL;
using FSHOP.Common.DTO.BanHang;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly SanPhamService _service;
        //GetALL
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            var result = _service.GetAllSanPham();
            return Ok(result);
        }
        //GetByID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(string id)
        {
            var result = _service.GetById(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        public SanPhamController(SanPhamService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Chỉ tài khoản có Role là Admin mới được thêm
        public IActionResult Create([FromBody] TaoSanPhamDTO dto)
        {
            var sanPham = new SanPham
            {
                MaSp = dto.MaSP,
                TenSp = dto.TenSP,
                DonGia = dto.DonGia,
                SoLuongTon = dto.SoLuongTon,
                MaDm = string.IsNullOrWhiteSpace(dto.MaDM) ? null : dto.MaDM
            };

            var result = _service.TaoSanPham(sanPham);

            if (result == "Thêm sản phẩm thành công")
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới được sửa
        public IActionResult Update(string id, [FromBody] CapNhatSanPhamDTO dto)
        {
            var sanPham = new SanPham
            {
                MaSp = id,
                TenSp = dto.TenSP,
                DonGia = dto.DonGia,
                SoLuongTon = dto.SoLuongTon,
                MaDm = string.IsNullOrWhiteSpace(dto.MaDM) ? null : dto.MaDM
            };

            var result = _service.CapNhatSanPham(id, sanPham);

            if (result == "Cập nhật sản phẩm thành công")
                return Ok(new { message = result });

            if (result == "Không tìm thấy sản phẩm")
                return NotFound(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới được sửa
        public IActionResult Delete(string id)
        {
            var result = _service.XoaSanPham(id);

            if (result == "Xóa sản phẩm thành công")
                return Ok(new { message = result });

            if (result == "Không tìm thấy sản phẩm")
                return NotFound(new { message = result });

            return BadRequest(new { message = result });
        }

        [HttpGet("tim-kiem")]
        [AllowAnonymous]
        public IActionResult TimKiem(string keyword)
        {
            var result = _service.TimKiemSanPham(keyword);
            return Ok(result);
        }

        //https://localhost:xxxx/api/sanpham/tim-kiem?keyword=hoa

        [HttpGet("loc-gia")]
        [AllowAnonymous]
        public IActionResult LocGia(decimal min, decimal max)
        {
            var result = _service.LocGia(min, max);
            return Ok(result);
        //https://localhost:xxxx/api/sanpham/loc-gia?min=10000&max=50000
        }

    }
}
