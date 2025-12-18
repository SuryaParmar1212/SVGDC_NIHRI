using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarouselController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CarouselController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Carousel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarouselItem>>> GetCarouselItems()
        {
            return await _context.CarouselItems
                .OrderBy(c => c.SortOrder)
                .ToListAsync();
        }

        // GET: api/Carousel/Active
        [HttpGet("Active")]
        public async Task<ActionResult<IEnumerable<CarouselItem>>> GetActiveCarouselItems()
        {
            return await _context.CarouselItems
                .Where(c => c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();
        }

        // POST: api/Carousel
        [HttpPost]
        public async Task<ActionResult<CarouselItem>> PostCarouselItem(CarouselItem carouselItem)
        {
            _context.CarouselItems.Add(carouselItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCarouselItems", new { id = carouselItem.Id }, carouselItem);
        }

        // PUT: api/Carousel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCarouselItem(int id, CarouselItem carouselItem)
        {
            if (id != carouselItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(carouselItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarouselItemExists(id))
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

        // DELETE: api/Carousel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCarouselItem(int id)
        {
            var carouselItem = await _context.CarouselItems.FindAsync(id);
            if (carouselItem == null)
            {
                return NotFound();
            }

            _context.CarouselItems.Remove(carouselItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarouselItemExists(int id)
        {
            return _context.CarouselItems.Any(e => e.Id == id);
        }
    }
}
