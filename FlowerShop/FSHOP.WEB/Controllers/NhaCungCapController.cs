using FSHOP.BLL;
using FSHOP.Common.DTOs.Kho;
using FSHOP.DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FSHOP.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly NhaCungCapService _service;

        public NhaCungCapController(NhaCungCapService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetById(string id)
        {
            var result = _service.GetById(id);

            if (result == null)
                return NotFound(new { message = "Không tìm thấy nhà cung cấp" });

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] TaoNhaCungCapDTO dto)
        {
            var ncc = new NhaCungCap
            {
                MaNcc = dto.MaNCC,
                TenNcc = dto.TenNCC,
                DiaChi = dto.DiaChi,
                Sdt = dto.SDT,
                Email = dto.Email,
                MaSoThue = dto.MaSoThue
            };

            var result = _service.Create(ncc);

            return Ok(new { message = result });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(string id, [FromBody] CapNhatNhaCungCapDTO dto)
        {
            var ncc = new NhaCungCap
            {
                TenNcc = dto.TenNcc,
                DiaChi = dto.DiaChi,
                Sdt = dto.Sdt,
                Email = dto.Email,
                MaSoThue = dto.MaSoThue
            };

            var result = _service.Update(id, ncc);

            if (result == "Cập nhật nhà cung cấp thành công")
                return Ok(new { message = result });

            return NotFound(new { message = result });
        }
    }
}
