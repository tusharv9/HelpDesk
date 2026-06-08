using System.Text.Json.Serialization;

namespace HelpdeskService.Models;

public class TicketComment
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    [JsonIgnore]
    public Ticket? Ticket { get; set; }

    public string CommentText { get; set; } = string.Empty;

    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
