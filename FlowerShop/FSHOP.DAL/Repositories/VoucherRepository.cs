using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Repositories
{
    public class VoucherRepository : GenericRepository<Voucher>, IVoucherRepository
    {
        public VoucherRepository(FshopContext context) : base(context) { }

        public bool IsValid(string maVoucher)
        {
            var now = DateTime.Now;
            return _dbSet.Any(v =>
                v.MaVoucher == maVoucher &&
                v.NgayBd <= DateOnly.FromDateTime(now) &&
                v.NgayKt >= DateOnly.FromDateTime(now) &&
                (v.SoLuong - v.SoLuongDaDung) > 0
            );
        }
    }
}
