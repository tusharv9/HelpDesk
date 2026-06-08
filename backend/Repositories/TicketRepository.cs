using HelpdeskService.Data;
using HelpdeskService.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskService.Repositories;

public class TicketRepository : ITicketRepository
{
    private readonly ApplicationDbContext _context;

    public TicketRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Ticket>> GetAllAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        string? assignedTo = null)
    {
        IQueryable<Ticket> query = _context.Tickets;

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(assignedTo))
        {
            query = query.Where(t => t.AssignedTo == assignedTo);
        }

        return await query.ToListAsync();
    }

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _context.Tickets.FindAsync(id);
    }

    public async Task AddAsync(Ticket ticket)
    {
        await _context.Tickets.AddAsync(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Ticket ticket)
    {
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Ticket ticket)
    {
        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();
    }

    // Comments & History implementation
    public async Task<IEnumerable<TicketComment>> GetCommentsAsync(int ticketId)
    {
        return await _context.TicketComments
            .Where(tc => tc.TicketId == ticketId)
            .OrderByDescending(tc => tc.CreatedAt)
            .ToListAsync();
    }

    public async Task AddCommentAsync(TicketComment comment)
    {
        await _context.TicketComments.AddAsync(comment);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<TicketHistory>> GetHistoryAsync(int ticketId)
    {
        return await _context.TicketHistories
            .Where(th => th.TicketId == ticketId)
            .OrderByDescending(th => th.ChangedAt)
            .ToListAsync();
    }

    public async Task AddHistoryAsync(TicketHistory history)
    {
        await _context.TicketHistories.AddAsync(history);
        await _context.SaveChangesAsync();
    }
}
