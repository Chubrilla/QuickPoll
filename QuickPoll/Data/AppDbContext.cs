using Microsoft.EntityFrameworkCore;
using QuickPoll.Models;

namespace QuickPoll.Data
{
    public class AppDbContext : DbContext
    {
        
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Option>()
                .HasOne(o => o.Poll)
                .WithMany(p => p.Options)
                .HasForeignKey(o => o.PollId);  // Явно указываем внешний ключ
        }
    }
}
