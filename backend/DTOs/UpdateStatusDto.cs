using System.ComponentModel.DataAnnotations;
using HelpdeskService.Models;

namespace HelpdeskService.DTOs;

public class UpdateStatusDto
{
    [Required]
    public TicketStatus Status { get; set; }
}
