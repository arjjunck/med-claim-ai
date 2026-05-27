using MediClaim.Api.Contracts.Auth;
using MediClaim.Application.Security;
using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace MediClaim.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MediClaimDbContext _db;
    private readonly PasswordService _passwordService;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(
        MediClaimDbContext db,
        PasswordService passwordService,
        JwtTokenService jwtTokenService)
    {
        _db = db;
        _passwordService = passwordService;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var emailExists = await _db.Users.AnyAsync(user => user.Email == email);

        if (emailExists)
        {
            return BadRequest("Email is already registered.");
        }

        var user = new AppUser
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = _passwordService.Hash(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwtTokenService.CreateToken(user);

        return Ok(new AuthResponse(token, user.Email, user.FullName));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users.FirstOrDefaultAsync(user => user.Email == email);

        if (user is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var passwordValid = _passwordService.Verify(user.PasswordHash, request.Password);

        if (!passwordValid)
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = _jwtTokenService.CreateToken(user);

        return Ok(new AuthResponse(token, user.Email, user.FullName));
    }

[Authorize]
[HttpGet("me")]
public async Task<IActionResult> Me()
{
    var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    if (string.IsNullOrWhiteSpace(userIdValue))
    {
        return Unauthorized("User ID was not found in token.");
    }

    var userId = Guid.Parse(userIdValue);

    var user = await _db.Users
        .Where(user => user.Id == userId)
        .Select(user => new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.CreatedAt
        })
        .FirstOrDefaultAsync();

    if (user is null)
    {
        return NotFound("User not found.");
    }

    return Ok(user);
}
}