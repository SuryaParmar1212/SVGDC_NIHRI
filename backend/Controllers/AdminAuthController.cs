using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models;
using Backend.Models.DTOs;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminAuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/AdminAuth/login
        [HttpPost("login")]
        public async Task<ActionResult<AdminResponseDto>> Login(AdminLoginDto loginDto)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == loginDto.Username && a.IsActive);

            if (admin == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, admin.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            // Update last login date
            admin.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(admin);

            return Ok(new AdminResponseDto
            {
                Id = admin.Id,
                Username = admin.Username,
                Email = admin.Email,
                FullName = admin.FullName,
                Token = token,
                Role = admin.Role
            });
        }

        // POST: api/AdminAuth/register
        [HttpPost("register")]
        public async Task<ActionResult<AdminResponseDto>> Register(AdminRegisterDto registerDto)
        {
            // Check if username already exists
            if (await _context.Admins.AnyAsync(a => a.Username == registerDto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Check if email already exists
            if (await _context.Admins.AnyAsync(a => a.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var admin = new Admin
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                IsActive = true,
                CreatedDate = DateTime.UtcNow,
                Role = "Admin"
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(admin);

            return CreatedAtAction(nameof(Login), new AdminResponseDto
            {
                Id = admin.Id,
                Username = admin.Username,
                Email = admin.Email,
                FullName = admin.FullName,
                Token = token,
                Role = admin.Role
            });
        }

        // GET: api/AdminAuth/verify
        [HttpGet("verify")]
        public async Task<ActionResult<AdminResponseDto>> VerifyToken()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "No token provided" });
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJWTTokenGeneration123456");
                
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var adminId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                var admin = await _context.Admins.FindAsync(adminId);
                
                if (admin == null || !admin.IsActive)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                return Ok(new AdminResponseDto
                {
                    Id = admin.Id,
                    Username = admin.Username,
                    Email = admin.Email,
                    FullName = admin.FullName,
                    Token = token,
                    Role = admin.Role
                });
            }
            catch
            {
                return Unauthorized(new { message = "Invalid token" });
            }
        }

        private string GenerateJwtToken(Admin admin)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJWTTokenGeneration123456");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", admin.Id.ToString()),
                    new Claim(ClaimTypes.Name, admin.Username),
                    new Claim(ClaimTypes.Email, admin.Email),
                    new Claim(ClaimTypes.Role, admin.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "60")),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
