using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using PhotoAlbumAPI.Models;

namespace PhotoAlbumAPI.Services;

public class AuthService
{
    private readonly IDbConnection _db;
    private readonly IConfiguration _config;

    public AuthService(IDbConnection db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<User?> Register(string email, string password)
    {
        var exists = await _db.ExecuteScalarAsync<bool>(
            "SELECT COUNT(1) FROM users WHERE email = @Email", new { Email = email });

        if (exists) return null;

        try
        {
            var hash = BCrypt.Net.BCrypt.HashPassword(password);
            var id = await _db.ExecuteScalarAsync<int>(
                "INSERT INTO users (email, password) VALUES (@Email, @Password) RETURNING id",
                new { Email = email, Password = hash });

            return new User { Id = id, Email = email };
        }
        catch (Npgsql.PostgresException ex) when (ex.SqlState == "23505")
        {
            return null;
        }
    }

    public async Task<string?> Login(string email, string password)
    {
        var user = await _db.QueryFirstOrDefaultAsync<User>(
            "SELECT * FROM users WHERE email = @Email", new { Email = email });

        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            return null;

        return GenerateToken(user);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
