namespace MediClaim.Domain.Entities;

public class ClaimRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string ClaimNumber { get; set; } = string.Empty;

    public string PatientReference { get; set; } = string.Empty;

    public string ProcedureCode { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime ClaimDate { get; set; }

    public string ProviderName { get; set; } = string.Empty;

    public string RiskLevel { get; set; } = "Low";

    public string RiskReason { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}