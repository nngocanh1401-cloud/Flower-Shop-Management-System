using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace FSHOP.DAL.Interfaces
{
    internal interface IVoucherRepository : IGenericRepository<Voucher>
    {
        // Kiểm tra xem mã voucher còn hạn và còn số lượng không
        bool IsValid(string maVoucher);
    }
}
