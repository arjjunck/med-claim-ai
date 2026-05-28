namespace MediClaim.Api.Contracts.Claims;

public record ClaimResponse(
    Guid Id,
    string ClaimNumber,
    string PatientReference,
    string ProcedureCode,
    decimal Amount,
    DateTime ClaimDate,
    string ProviderName,
    string RiskLevel,
    string RiskReason
);