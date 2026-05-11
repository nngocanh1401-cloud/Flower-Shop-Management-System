using FSHOP.DAL.Interfaces;
using FSHOP.DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace FSHOP.DAL.Repositories
{
    // Dùng Entity Framework
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly FshopContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(FshopContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }
        public IEnumerable<T> GetAll() => _dbSet.ToList();
        public T GetById(object id) => _dbSet.Find(id);

        public void Add(T entity)
        {
            _dbSet.Add(entity);
        }
        public void Update(T entity)
        {
            _dbSet.Attach(entity);

            _context.Entry(entity).State = EntityState.Modified;
        }
        public void Delete(object id)
        {
            var entity = _dbSet.Find(id);

            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
