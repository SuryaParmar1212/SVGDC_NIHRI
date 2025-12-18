using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.Data.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IRepository<Announcement> _announcementRepository;

        public AnnouncementsController(IRepository<Announcement> announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        // GET: api/Announcements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Announcement>>> GetAnnouncements()
        {
            try
            {
                var announcements = await _announcementRepository.GetAsync(
                    filter: null,
                    orderBy: q => q.OrderByDescending(a => a.Priority).ThenByDescending(a => a.CreatedDate)
                );
                return Ok(announcements);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Announcements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Announcement>> GetAnnouncement(int id)
        {
            try
            {
                var announcement = await _announcementRepository.GetByIdAsync(id);

                if (announcement == null)
                {
                    return NotFound();
                }

                return Ok(announcement);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/Announcements
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Announcement>> PostAnnouncement(Announcement announcement)
        {
            try
            {
                announcement.CreatedDate = announcement.CreatedDate.ToUniversalTime();
                if (announcement.ExpiryDate.HasValue)
                {
                    announcement.ExpiryDate = announcement.ExpiryDate.Value.ToUniversalTime();
                }
                
                await _announcementRepository.AddAsync(announcement);
                await _announcementRepository.SaveAsync();

                return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/Announcements/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnnouncement(int id, Announcement announcement)
        {
            if (id != announcement.Id)
            {
                return BadRequest();
            }

            try
            {
                _announcementRepository.Update(announcement);
                await _announcementRepository.SaveAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                 return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Announcements/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(int id)
        {
            try
            {
                var announcement = await _announcementRepository.GetByIdAsync(id);
                if (announcement == null)
                {
                    return NotFound();
                }

                await _announcementRepository.DeleteAsync(id);
                await _announcementRepository.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
