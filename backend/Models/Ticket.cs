namespace HelpdeskService.Models;

public class Ticket
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public TicketPriority Priority { get; set; } = TicketPriority.Low;

    public TicketStatus Status { get; set; } = TicketStatus.Open;

    public string CreatedBy { get; set; } = string.Empty;

    public string? AssignedTo { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}