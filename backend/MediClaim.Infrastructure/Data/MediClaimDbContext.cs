using MediClaim.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.ToTable("Users");

            entity.HasKey(user => user.Id);

            entity.HasIndex(user => user.Email)
                .IsUnique();

            entity.Property(user => user.FullName)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(user => user.Email)
                .HasMaxLength(250)
                .IsRequired();

            entity.Property(user => user.PasswordHash)
                .IsRequired();
        });

        modelBuilder.Entity<UploadedDocument>(entity =>
        {
            entity.ToTable("Documents");

            entity.HasKey(document => document.Id);

            entity.Property(document => document.FileName)
                .HasMaxLength(300)
                .IsRequired();

            entity.Property(document => document.DocumentType)
                .HasMaxLength(50)
                .IsRequired();

            entity.HasMany(document => document.Chunks)
                .WithOne(chunk => chunk.Document)
                .HasForeignKey(chunk => chunk.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DocumentChunk>(entity =>
        {
            entity.ToTable("DocumentChunks");

            entity.HasKey(chunk => chunk.Id);

            entity.Property(chunk => chunk.Content)
                .IsRequired();

            entity.Property(chunk => chunk.SourcePage)
                .HasMaxLength(50);
        });

        modelBuilder.Entity<ClaimRecord>(entity =>
        {
            entity.ToTable("Claims");

            entity.HasKey(claim => claim.Id);

            entity.Property(claim => claim.ClaimNumber)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(claim => claim.PatientReference)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(claim => claim.ProcedureCode)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(claim => claim.ProviderName)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(claim => claim.RiskLevel)
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(claim => claim.Amount)
                .HasPrecision(18, 2);
        });

        modelBuilder.Entity<ChatHistory>(entity =>
        {
            entity.ToTable("ChatHistory");

            entity.HasKey(chat => chat.Id);

            entity.Property(chat => chat.Question)
                .IsRequired();

            entity.Property(chat => chat.Answer)
                .IsRequired();
        });
    }
}