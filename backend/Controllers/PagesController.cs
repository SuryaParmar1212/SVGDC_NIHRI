using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Page>>> GetPages()
        {
            return await _context.Pages.ToListAsync();
        }

        // GET: api/Pages/slug/about-us
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Page>> GetPageBySlug(string slug)
        {
            var page = await _context.Pages.FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

            if (page == null)
            {
                return NotFound();
            }

            return page;
        }

        // GET: api/Pages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Page>> GetPage(int id)
        {
            var page = await _context.Pages.FindAsync(id);

            if (page == null)
            {
                return NotFound();
            }

            return page;
        }

        // POST: api/Pages
        [HttpPost]
        public async Task<ActionResult<Page>> PostPage(Page page)
        {
            // Ensure slug is unique
            if (await _context.Pages.AnyAsync(p => p.Slug == page.Slug))
            {
                return BadRequest("Slug already exists.");
            }

            _context.Pages.Add(page);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPage", new { id = page.Id }, page);
        }

        // PUT: api/Pages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPage(int id, Page page)
        {
            if (id != page.Id)
            {
                return BadRequest();
            }

            // Check slug uniqueness if changed
            var existingPage = await _context.Pages.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
            if (existingPage != null && existingPage.Slug != page.Slug)
            {
                 if (await _context.Pages.AnyAsync(p => p.Slug == page.Slug))
                {
                    return BadRequest("Slug already exists.");
                }
            }

            page.UpdatedDate = DateTime.UtcNow;
            _context.Entry(page).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Pages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePage(int id)
        {
            var page = await _context.Pages.FindAsync(id);
            if (page == null)
            {
                return NotFound();
            }

            _context.Pages.Remove(page);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PageExists(int id)
        {
            return _context.Pages.Any(e => e.Id == id);
        }
    }
}
