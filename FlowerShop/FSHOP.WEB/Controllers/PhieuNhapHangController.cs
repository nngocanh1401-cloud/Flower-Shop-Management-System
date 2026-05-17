using FSHOP.BLL;
using FSHOP.Common.DTO.Kho;
using FSHOP.DAL.Models;
using FSHOP.Common.DTOs.Kho;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]

    public class PhieuNhapHangController : ControllerBase
    {
        private readonly PhieuNhapHangService _phieuNhapHangService;

        public PhieuNhapHangController(PhieuNhapHangService service)
        {
            _phieuNhapHangService = service;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            return Ok(_phieuNhapHangService.GetAll());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetById(string id)
        {
            var result = _phieuNhapHangService.GetById(id);

            if (result == null)
                return NotFound(new { message = "Không tìm thấy phiếu nhập" });

            return Ok(result);
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult TaoPhieuNhap([FromBody] TaoPhieuNhapDTO dto)
        {
            var result = _phieuNhapHangService.TaoPhieuNhap(dto);

            if (result == "Nhập hàng thành công")
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(string id, [FromBody] CapNhatPhieuNhapDTO dto)
        {
            var result = _phieuNhapHangService.CapNhatPhieuNhap(id, dto);

            if (result == "Cập nhật phiếu nhập thành công")
                return Ok(new { message = result });

            return BadRequest(new { message = result });
        }
    }
}

