using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSHOP.DAL.Repositories
{
    public class DanhMucRepository : GenericRepository<DanhMuc>, IDanhMucRepository
    {
        public DanhMucRepository(FshopContext context) : base(context) { }

        public IEnumerable<DanhMuc> GetDanhMucCon(string maDMCha)
        {
            return _dbSet
                .Where(dm => dm.MaDmcha == maDMCha)
                .ToList();
        }
    }
}
