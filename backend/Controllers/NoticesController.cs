using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.Data.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly IRepository<Notice> _noticesRepository;

        public NoticesController(IRepository<Notice> noticesRepository)
        {
            _noticesRepository = noticesRepository;
        }

        // GET: api/Notices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notice>>> GetNotices()
        {
            try
            {
                var notices = await _noticesRepository.GetAsync(
                    filter: n => n.IsActive,
                    orderBy: q => q.OrderByDescending(n => n.PublishedDate)
                );
                return Ok(notices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Notices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Notice>> GetNotice(int id)
        {
            try
            {
                var notice = await _noticesRepository.GetByIdAsync(id);

                if (notice == null)
                {
                    return NotFound();
                }

                return Ok(notice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Notices
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Notice>> PostNotice(Notice notice)
        {
            try
            {
                notice.PublishedDate = DateTime.UtcNow; // Ensure Utc for consistency
                if (notice.ExpiryDate.HasValue)
                {
                    notice.ExpiryDate = notice.ExpiryDate.Value.ToUniversalTime();
                }

                await _noticesRepository.AddAsync(notice);
                await _noticesRepository.SaveAsync();

                return CreatedAtAction(nameof(GetNotice), new { id = notice.Id }, notice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Notices/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotice(int id, Notice notice)
        {
            if (id != notice.Id)
            {
                return BadRequest();
            }

            try
            {
                if (notice.ExpiryDate.HasValue)
                {
                    notice.ExpiryDate = notice.ExpiryDate.Value.ToUniversalTime();
                }
                
                _noticesRepository.Update(notice);
                await _noticesRepository.SaveAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Notices/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            try
            {
                var notice = await _noticesRepository.GetByIdAsync(id);
                if (notice == null)
                {
                    return NotFound();
                }

                await _noticesRepository.DeleteAsync(id);
                await _noticesRepository.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
