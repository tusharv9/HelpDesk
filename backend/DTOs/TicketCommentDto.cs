namespace HelpdeskService.DTOs;

public class TicketCommentDto
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    public string CommentText { get; set; } = string.Empty;

    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
