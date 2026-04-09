using Microsoft.AspNetCore.Mvc;
using PhotoAlbumAPI.Services;

namespace PhotoAlbumAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = await _authService.Register(request.Email, request.Password);
        if (user == null)
            return BadRequest(new { message = "Email já cadastrado" });

        return Ok(new { id = user.Id, email = user.Email });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var token = await _authService.Login(request.Email, request.Password);
        if (token == null)
            return Unauthorized(new { message = "Credenciais inválidas" });

        return Ok(new { token });
    }
}

public record RegisterRequest(string Email, string Password);
public record LoginRequest(string Email, string Password);
