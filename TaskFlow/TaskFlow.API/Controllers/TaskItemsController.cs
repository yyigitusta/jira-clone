using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Data;
using TaskFlow.API.Entities;

namespace TaskFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TaskItemsController(AppDbContext context)
        { 
        _context= context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetTaskItems()
        {
            return await _context.TaskItems
                .Include(t => t.Project)
                .Include(t => t.Assignee)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> PostTaskItem(TaskItem taskItem)
        {
            _context.TaskItems.Add(taskItem);
            await  _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTaskItems), new { id = taskItem.Id }, taskItem);
        }
    }
}
