using Microsoft.AspNetCore.Mvc;

namespace MediClaim.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "Healthy",
            app = "MediClaim AI",
            message = "Backend API is running successfully",
            time = DateTime.UtcNow
        });
    }
}