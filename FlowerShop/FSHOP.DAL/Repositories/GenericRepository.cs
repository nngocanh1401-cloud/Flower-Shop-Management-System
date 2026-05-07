using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace FSHOP.DAL.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly FshopContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(FshopContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public IEnumerable<T> GetAll()
        {
            return _dbSet.ToList();
        }

        public T GetById(object id)
        {
            return _dbSet.Find(id);
        }

        public void Add(T entity)
        {
            _dbSet.Add(entity);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
            _context.SaveChanges();
        }

        public void Delete(object id)
        {
            T entity = _dbSet.Find(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                _context.SaveChanges();
            }

        }
    }
}
