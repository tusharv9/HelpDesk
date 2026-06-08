using HelpdeskService.DTOs;
using HelpdeskService.Models;

namespace HelpdeskService.Services;

public interface ITicketService
{
    Task<IEnumerable<TicketDto>> GetAllAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        string? assignedTo = null);

    Task<TicketDto?> GetByIdAsync(int id);

    Task<TicketDto> CreateAsync(CreateTicketDto createDto, string createdBy);

    Task<TicketDto?> UpdateAsync(int id, UpdateTicketDto updateDto, string changedBy);

    Task<bool> DeleteAsync(int id);

    Task<TicketDto?> UpdateStatusAsync(int id, TicketStatus status, string changedBy);

    Task<TicketDto?> AssignAsync(int id, string? assignedTo, string changedBy);

    // Advanced features
    Task<TicketCommentDto> AddCommentAsync(int ticketId, CreateCommentDto commentDto, string createdBy);

    Task<IEnumerable<TicketCommentDto>> GetCommentsAsync(int ticketId);

    Task<IEnumerable<TicketHistoryDto>> GetHistoryAsync(int ticketId);
}
