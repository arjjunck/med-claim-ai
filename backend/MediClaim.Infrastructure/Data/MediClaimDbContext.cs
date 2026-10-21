using MediClaim.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MediClaim.Infrastructure.Data;

public class MediClaimDbContext : DbContext
{
    public MediClaimDbContext(DbContextOptions<MediClaimDbContext> options)
        : base(options)
    {
    }

    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<UploadedDocument> Documents => Set<UploadedDocument>();
    public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();
    public DbSet<ClaimRecord> Claims => Set<ClaimRecord>();
    public DbSet<ChatHistory> ChatHistory => Set<ChatHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var vectorConverter = new ValueConverter<float[]?, string?>(
            v => v == null ? null : string.Join(",", v),
            v => v == null ? null : v.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                     .Select(float.Parse)
                                     .ToArray()
        );

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FullName).HasMaxLength(150).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(250).IsRequired();
            entity.Property(u => u.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<UploadedDocument>(entity =>
        {
            entity.ToTable("Documents");
            entity.HasKey(d => d.Id);
            entity.Property(d => d.FileName).HasMaxLength(300).IsRequired();
            entity.Property(d => d.DocumentType).HasMaxLength(50).IsRequired();
            entity.HasMany(d => d.Chunks)
                  .WithOne(c => c.Document)
                  .HasForeignKey(c => c.DocumentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DocumentChunk>(entity =>
        {
            entity.ToTable("DocumentChunks");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Content).IsRequired();
            entity.Property(c => c.SourcePage).HasMaxLength(50);
            entity.Property(c => c.Embedding)
                  .HasColumnType("text")
                  .HasConversion(vectorConverter);
        });

        modelBuilder.Entity<ClaimRecord>(entity =>
        {
            entity.ToTable("Claims");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.ClaimNumber).HasMaxLength(100).IsRequired();
            entity.Property(c => c.PatientReference).HasMaxLength(100).IsRequired();
            entity.Property(c => c.ProcedureCode).HasMaxLength(100).IsRequired();
            entity.Property(c => c.ProviderName).HasMaxLength(200).IsRequired();
            entity.Property(c => c.RiskLevel).HasMaxLength(30).IsRequired();
            entity.Property(c => c.Amount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<ChatHistory>(entity =>
        {
            entity.ToTable("ChatHistory");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Question).IsRequired();
            entity.Property(c => c.Answer).IsRequired();
        });
    }
}
