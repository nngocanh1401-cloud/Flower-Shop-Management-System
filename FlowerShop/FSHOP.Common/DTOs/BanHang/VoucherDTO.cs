using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.Common.DTO.BanHang
{
    //Chỉ lấy những thông tin khách cần thấy
    public class VoucherDTO
    {
        public string MaVoucher { get; set; }
        public string TenVoucher { get; set; }
        public decimal GiaTriGiam { get; set; }
        public string LoaiGiam { get; set; }
        public decimal DieuKienApDung { get; set; }
    }
}
