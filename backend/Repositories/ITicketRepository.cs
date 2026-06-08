using HelpdeskService.Models;

namespace HelpdeskService.Repositories;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetAllAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        string? assignedTo = null);

    Task<Ticket?> GetByIdAsync(int id);

    Task AddAsync(Ticket ticket);

    Task UpdateAsync(Ticket ticket);

    Task DeleteAsync(Ticket ticket);

    // Comments & History
    Task<IEnumerable<TicketComment>> GetCommentsAsync(int ticketId);

    Task AddCommentAsync(TicketComment comment);

    Task<IEnumerable<TicketHistory>> GetHistoryAsync(int ticketId);

    Task AddHistoryAsync(TicketHistory history);
}
