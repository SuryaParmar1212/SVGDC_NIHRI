using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NavigationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NavigationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Navigation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NavigationItem>>> GetNavigationItems()
        {
            // Fetch root items and their children recursively (or just fetch all and build tree in frontend)
            // Ideally, for deep nesting, fetching all and tree-ifying in C# or JS is better. 
            // Simple approach: Fetch all, ordered by Order.
            return await _context.NavigationItems.OrderBy(n => n.Order).ToListAsync();
        }

        // GET: api/Navigation/tree
        [HttpGet("tree")]
        public async Task<ActionResult<IEnumerable<NavigationItem>>> GetNavigationTree()
        {
            var allItems = await _context.NavigationItems.OrderBy(n => n.Order).ToListAsync();
            
            // Build tree
            var rootItems = allItems.Where(n => n.ParentId == null).ToList();
            
            foreach (var item in rootItems)
            {
                LoadChildren(item, allItems);
            }

            return rootItems;
        }

        private void LoadChildren(NavigationItem item, List<NavigationItem> allItems)
        {
            item.Children = allItems.Where(n => n.ParentId == item.Id).OrderBy(n => n.Order).ToList();
            foreach (var child in item.Children)
            {
                LoadChildren(child, allItems);
            }
        }

        // GET: api/Navigation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NavigationItem>> GetNavigationItem(int id)
        {
            var navigationItem = await _context.NavigationItems.FindAsync(id);

            if (navigationItem == null)
            {
                return NotFound();
            }

            return navigationItem;
        }

        // POST: api/Navigation
        [HttpPost]
        public async Task<ActionResult<NavigationItem>> PostNavigationItem(NavigationItem navigationItem)
        {
            _context.NavigationItems.Add(navigationItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNavigationItem", new { id = navigationItem.Id }, navigationItem);
        }

        // PUT: api/Navigation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNavigationItem(int id, NavigationItem navigationItem)
        {
            if (id != navigationItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(navigationItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NavigationItemExists(id))
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

        // DELETE: api/Navigation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNavigationItem(int id)
        {
            var navigationItem = await _context.NavigationItems.FindAsync(id);
            if (navigationItem == null)
            {
                return NotFound();
            }

            // Optional: Handle children deletion or re-parenting
            // For now, let's cascade delete manually if foreign key cascade isn't set up, 
            // or just assume standard behavior. 
            // Better to block if children exist or recursively delete.
            
            // Simple recursive delete for now
            await DeleteitemRecursive(navigationItem.Id);

            return NoContent();
        }

        private async Task DeleteitemRecursive(int id)
        {
            var children = await _context.NavigationItems.Where(n => n.ParentId == id).ToListAsync();
            foreach(var child in children)
            {
                await DeleteitemRecursive(child.Id);
            }
            
            var item = await _context.NavigationItems.FindAsync(id);
            if(item != null)
                 _context.NavigationItems.Remove(item);
            
            await _context.SaveChangesAsync();
        }

        private bool NavigationItemExists(int id)
        {
            return _context.NavigationItems.Any(e => e.Id == id);
        }
    }
}
