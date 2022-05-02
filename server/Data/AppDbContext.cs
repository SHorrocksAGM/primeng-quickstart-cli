
using System;
using Microsoft.EntityFrameworkCore;

namespace ProductsApi.Data;

public class AppDbContext : DbContext {

    public DbSet<Product> Products { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> opts): base(opts) {

    }
}