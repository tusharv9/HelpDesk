using System.ComponentModel.DataAnnotations;
using HelpdeskService.Models;

namespace HelpdeskService.DTOs;

public class CreateTicketDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public TicketPriority Priority { get; set; } = TicketPriority.Low;
}
