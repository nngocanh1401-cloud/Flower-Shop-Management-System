using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.Kho
{
    //Xem danh sách trả hàng
    internal class PhieuTraHangDTO
    {
        public string MaPhieuTra { get; set; }
        public string MaPhieuNhap { get; set; }
        public string TenTrangThai { get; set; }
        public DateTime? NgayTra { get; set; }
        public string LyDo { get; set; }
        public decimal? TongTienTra { get; set; }
    }
}
