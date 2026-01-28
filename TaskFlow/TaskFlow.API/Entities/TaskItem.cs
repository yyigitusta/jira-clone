using System.ComponentModel.DataAnnotations.Schema;
using TaskFlow.API.Entities.Enums;

namespace TaskFlow.API.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }=string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; } // Bitiş Tarihi

        // Enumlarımızı kullanıyoruz
        public Enums.TaskStatus Status { get; set; } = Enums.TaskStatus.ToDo;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        // İLİŞKİ 1: Hangi Projeye Ait? (Foreign Key)
        public int ProjectId { get; set; }
        // Bu property veritabanında sütun olmaz, kod içinde gezinmek içindir (Navigation Property)
        [ForeignKey("ProjectId")]
        public Project? Project { get; set; }

        // İLİŞKİ 2: Kime Atandı? (Foreign Key)
        public int? AssigneeId { get; set; } // Boş olabilir (henüz atanmamış)
        [ForeignKey("AssigneeId")]
        public User? Assignee { get; set; }
    }
}
