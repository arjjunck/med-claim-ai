using System.Globalization;
using System.Security.Claims;
using CsvHelper;
using CsvHelper.Configuration;
using MediClaim.Api.Contracts.Claims;
using MediClaim.Application.Claims;
using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediClaim.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly MediClaimDbContext _db;
    private readonly ClaimRiskEngine _riskEngine;

    public ClaimsController(MediClaimDbContext db, ClaimRiskEngine riskEngine)
    {
        _db = db;
        _riskEngine = riskEngine;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file.Length == 0)
        {
            return BadRequest("Uploaded file is empty.");
        }

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Only CSV files are supported.");
        }

        var userId = GetCurrentUserId();

        using var reader = new StreamReader(file.OpenReadStream());

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HeaderValidated = null,
            MissingFieldFound = null,
            PrepareHeaderForMatch = args => args.Header.Trim().ToLowerInvariant()
        };

        using var csv = new CsvReader(reader, config);

        var rows = csv.GetRecords<ClaimCsvRow>().ToList();

        var existingClaims = await _db.Claims
            .Where(claim => claim.UserId == userId)
            .ToListAsync();

        var newClaims = new List<ClaimRecord>();

        foreach (var row in rows)
        {
            var claim = new ClaimRecord
            {
                UserId = userId,
                ClaimNumber = row.ClaimNumber,
                PatientReference = row.PatientReference,
                ProcedureCode = row.ProcedureCode,
                Amount = row.Amount,
                ClaimDate = DateTime.SpecifyKind(row.ClaimDate, DateTimeKind.Utc),
                ProviderName = row.ProviderName
            };

            var risk = _riskEngine.Analyse(claim, existingClaims.Concat(newClaims).ToList());

            claim.RiskLevel = risk.RiskLevel;
            claim.RiskReason = risk.RiskReason;

            newClaims.Add(claim);
        }

        _db.Claims.AddRange(newClaims);
        await _db.SaveChangesAsync();

        var response = newClaims.Select(ToResponse).ToList();

        return Ok(new
        {
            UploadedCount = response.Count,
            HighRiskCount = response.Count(claim => claim.RiskLevel == "High"),
            MediumRiskCount = response.Count(claim => claim.RiskLevel == "Medium"),
            LowRiskCount = response.Count(claim => claim.RiskLevel == "Low"),
            Claims = response
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<ClaimResponse>>> GetMyClaims()
    {
        var userId = GetCurrentUserId();

        var claims = await _db.Claims
            .Where(claim => claim.UserId == userId)
            .OrderByDescending(claim => claim.CreatedAt)
            .Select(claim => ToResponse(claim))
            .ToListAsync();

        return Ok(claims);
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdValue))
        {
            throw new UnauthorizedAccessException("User ID was not found in token.");
        }

        return Guid.Parse(userIdValue);
    }

    private static ClaimResponse ToResponse(ClaimRecord claim)
    {
        return new ClaimResponse(
            claim.Id,
            claim.ClaimNumber,
            claim.PatientReference,
            claim.ProcedureCode,
            claim.Amount,
            claim.ClaimDate,
            claim.ProviderName,
            claim.RiskLevel,
            claim.RiskReason
        );
    }

    private class ClaimCsvRow
    {
        public string ClaimNumber { get; set; } = string.Empty;

        public string PatientReference { get; set; } = string.Empty;

        public string ProcedureCode { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateTime ClaimDate { get; set; }

        public string ProviderName { get; set; } = string.Empty;
    }
}