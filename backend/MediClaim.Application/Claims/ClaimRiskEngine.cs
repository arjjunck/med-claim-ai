using MediClaim.Domain.Entities;

namespace MediClaim.Application.Claims;

public class ClaimRiskEngine
{
    public (string RiskLevel, string RiskReason) Analyse(
        ClaimRecord claim,
        List<ClaimRecord> existingClaims)
    {
        var duplicate = existingClaims.Any(existing =>
            existing.ClaimNumber == claim.ClaimNumber);

        if (duplicate)
        {
            return ("High", "Duplicate claim number found.");
        }

        if (claim.Amount >= 1500)
        {
            return ("High", "High claim amount requires manual review.");
        }

        if (claim.Amount >= 750)
        {
            return ("Medium", "Claim amount is above normal review threshold.");
        }

        if (claim.ProcedureCode.Equals("DENTAL", StringComparison.OrdinalIgnoreCase))
        {
            return ("Medium", "Dental procedure may require policy coverage confirmation.");
        }

        return ("Low", "No major rule-based risk detected.");
    }
}