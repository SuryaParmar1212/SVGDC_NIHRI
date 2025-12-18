using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.Data.Repositories;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IRepository<News> _newsRepository;

        public NewsController(IRepository<News> newsRepository)
        {
            _newsRepository = newsRepository;
        }

        // GET: api/News
        [HttpGet]
        public async Task<ActionResult<IEnumerable<News>>> GetNews()
        {
            try
            {
                var newsList = await _newsRepository.GetAsync(
                    filter: n => n.IsActive,
                    orderBy: q => q.OrderByDescending(n => n.PublishedDate)
                );
                return Ok(newsList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/News/5
        [HttpGet("{id}")]
        public async Task<ActionResult<News>> GetNews(int id)
        {
            try
            {
                var news = await _newsRepository.GetByIdAsync(id);

                if (news == null)
                {
                    return NotFound();
                }

                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/News/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<News>>> GetNewsByCategory(string category)
        {
            try
            {
                var newsList = await _newsRepository.GetAsync(
                    filter: n => n.IsActive && n.Category == category,
                    orderBy: q => q.OrderByDescending(n => n.PublishedDate)
                );
                return Ok(newsList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/News
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<News>> PostNews(News news)
        {
            try
            {
                news.PublishedDate = news.PublishedDate.ToUniversalTime();
                await _newsRepository.AddAsync(news);
                await _newsRepository.SaveAsync();

                return CreatedAtAction(nameof(GetNews), new { id = news.Id }, news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/News/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNews(int id, News news)
        {
            if (id != news.Id)
            {
                return BadRequest();
            }

            try
            {
                _newsRepository.Update(news);
                await _newsRepository.SaveAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/News/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            try
            {
                var news = await _newsRepository.GetByIdAsync(id);
                if (news == null)
                {
                    return NotFound();
                }

                await _newsRepository.DeleteAsync(id);
                await _newsRepository.SaveAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
