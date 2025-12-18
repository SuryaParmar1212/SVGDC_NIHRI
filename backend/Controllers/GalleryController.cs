using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.Data.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly IRepository<Gallery> _galleryRepository;

        public GalleryController(IRepository<Gallery> galleryRepository)
        {
            _galleryRepository = galleryRepository;
        }

        // GET: api/Gallery
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gallery>>> GetGallery()
        {
            try
            {
                var galleryItems = await _galleryRepository.GetAsync(
                    filter: g => g.IsActive,
                    orderBy: q => q.OrderByDescending(g => g.UploadedDate)
                );
                return Ok(galleryItems);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Gallery/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Gallery>> GetGalleryItem(int id)
        {
            try
            {
                var item = await _galleryRepository.GetByIdAsync(id);

                if (item == null)
                {
                    return NotFound();
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Gallery/5
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Gallery>> PostGalleryItem(Gallery galleryItem)
        {
            try
            {
                galleryItem.UploadedDate = galleryItem.UploadedDate.ToUniversalTime();
                await _galleryRepository.AddAsync(galleryItem);
                await _galleryRepository.SaveAsync();

                return CreatedAtAction(nameof(GetGalleryItem), new { id = galleryItem.Id }, galleryItem);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Gallery/Upload
        [Authorize]
        [HttpPost("Upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            // Create uploads folder if it doesn't exist
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolderPath))
                Directory.CreateDirectory(uploadsFolderPath);

            // Generate unique file name
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the full URL (assuming standard host for now, or relative path)
            // A relative path is usually better if the frontend and backend are on same domain or proxied.
            // If completely separate, we might need the host. Angular usually handles relative paths if proxied.
            // But let's return a relative path that the frontend can prepend with API_URL if needed,
            // or just serve it directly if the backend is the static file server.
            // Current setup: Angular 4200, Dotnet 5018. static files are on 5018.
            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";
            var fileUrl = $"{baseUrl}/uploads/{fileName}";
            
            return Ok(new { url = fileUrl });
        }

        // PUT: api/Gallery/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGalleryItem(int id, Gallery galleryItem)
        {
            if (id != galleryItem.Id)
            {
                return BadRequest();
            }

            try
            {
                _galleryRepository.Update(galleryItem);
                await _galleryRepository.SaveAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Gallery/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGalleryItem(int id)
        {
            try
            {
                var item = await _galleryRepository.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }

                await _galleryRepository.DeleteAsync(id);
                await _galleryRepository.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
