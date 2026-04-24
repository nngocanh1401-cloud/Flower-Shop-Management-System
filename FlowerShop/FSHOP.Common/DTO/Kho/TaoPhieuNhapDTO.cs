using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    //Nhận dữ liệu từ form tạo phiếu
    internal class TaoPhieuNhapDTO
    {
        // Phần ghi vào bảng PhieuNhapHang
        public string MaNCC { get; set; }
        public int MaTrangThai { get; set; }

        // Phần ghi vào bảng ChiTietPhieuNhap
        public List<ChiTietPhieuNhapDTO> DanhSachChiTiet { get; set; }
    }
}
