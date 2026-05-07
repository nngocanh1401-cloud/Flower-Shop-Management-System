using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Repositories
{
    public class KhachHangRepository : GenericRepository<KhachHang>, IKhachHangRepository
    {
        public KhachHangRepository(FshopContext context) : base(context) { }

        public KhachHang GetBySDT(string sdt)
        {
            return _dbSet.FirstOrDefault(kh => kh.Sdt == sdt);
        }
    }
}
