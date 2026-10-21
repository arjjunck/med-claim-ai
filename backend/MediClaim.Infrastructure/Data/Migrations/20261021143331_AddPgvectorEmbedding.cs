using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediClaim.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPgvectorEmbedding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS vector;");
            
            migrationBuilder.DropColumn(
                name: "EmbeddingJson",
                table: "DocumentChunks");

            migrationBuilder.AddColumn<string>(
                name: "Embedding",
                table: "DocumentChunks",
                type: "vector(1536)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Embedding",
                table: "DocumentChunks");

            migrationBuilder.AddColumn<string>(
                name: "EmbeddingJson",
                table: "DocumentChunks",
                type: "text",
                nullable: true);
        }
    }
}
