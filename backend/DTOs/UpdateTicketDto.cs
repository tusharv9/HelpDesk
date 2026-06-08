using System.ComponentModel.DataAnnotations;
using HelpdeskService.Models;

namespace HelpdeskService.DTOs;

public class UpdateTicketDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public TicketPriority Priority { get; set; }

    [Required]
    public TicketStatus Status { get; set; }
}
