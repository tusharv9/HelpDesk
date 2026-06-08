using System.Text.Json.Serialization;

namespace HelpdeskService.Models;

public class TicketHistory
{
    public int Id { get; set; }

    public int TicketId { get; set; }

    [JsonIgnore]
    public Ticket? Ticket { get; set; }

    public string FieldName { get; set; } = string.Empty;

    public string OldValue { get; set; } = string.Empty;

    public string NewValue { get; set; } = string.Empty;

    public string ChangedBy { get; set; } = string.Empty;

    public DateTime ChangedAt { get; set; }
}
