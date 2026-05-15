using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    //Chỉ lấy những thông tin khách cần thấy
    public class VoucherDTO
    {
        public string MaVoucher { get; set; } = string.Empty;
        public string TenVoucher { get; set; } = string.Empty;
        public DateOnly NgayBd { get; set; }
        public DateOnly NgayKt { get; set; }
        public decimal GiaTriGiam { get; set; }
        public string LoaiGiam { get; set; } = string.Empty;
        public decimal DieuKienApDung { get; set; }
        public int SoLuong { get; set; }
    }
}
