namespace TaskFlow.API.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }//? işareti boş olabilir demek

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
