using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    internal class TaoPhieuTraHangDTO
    {
        // Phần ghi vào bảng PhieuTraHang
        public string MaPhieuNhap { get; set; }
        public int MaTrangThai { get; set; }
        public string LyDo { get; set; }

        // Phần ghi vào bảng ChiTietPhieuTra
        public List<ChiTietPhieuTraDTO> DanhSachChiTiet { get; set; }
    }
}
