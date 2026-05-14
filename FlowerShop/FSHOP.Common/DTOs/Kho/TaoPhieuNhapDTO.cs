using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    //Nhận dữ liệu từ form tạo phiếu
    public class TaoPhieuNhapDTO
    {
        public string MaPhieuNhap { get; set; } = string.Empty;

        public string MaNCC { get; set; } = string.Empty;

        public List<ChiTietPhieuNhapDTO> DanhSachChiTiet { get; set; } = new();
    }
}
