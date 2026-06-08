using HelpdeskService.DTOs;
using HelpdeskService.Exceptions;
using HelpdeskService.Models;
using HelpdeskService.Repositories;

namespace HelpdeskService.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _repository;

    public TicketService(ITicketRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TicketDto>> GetAllAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        string? assignedTo = null)
    {
        var tickets = await _repository.GetAllAsync(status, priority, assignedTo);
        return tickets.Select(MapToDto);
    }

    public async Task<TicketDto?> GetByIdAsync(int id)
    {
        var ticket = await _repository.GetByIdAsync(id);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {id} was not found.");

        return MapToDto(ticket);
    }

    public async Task<TicketDto> CreateAsync(CreateTicketDto createDto, string createdBy)
    {
        var ticket = new Ticket
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Category = createDto.Category,
            Priority = createDto.Priority,
            Status = TicketStatus.Open,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(ticket);

        // Audit ticket creation
        await LogHistoryAsync(ticket.Id, "Ticket", "", "Created", createdBy);

        return MapToDto(ticket);
    }

    public async Task<TicketDto?> UpdateAsync(int id, UpdateTicketDto updateDto, string changedBy)
    {
        var ticket = await _repository.GetByIdAsync(id);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {id} was not found.");

        // Check and log status change
        if (ticket.Status != updateDto.Status)
        {
            ValidateStatusTransition(ticket.Status, updateDto.Status);
            await LogHistoryAsync(id, nameof(Ticket.Status), ticket.Status.ToString(), updateDto.Status.ToString(), changedBy);
        }

        // Check and log priority change
        if (ticket.Priority != updateDto.Priority)
        {
            await LogHistoryAsync(id, nameof(Ticket.Priority), ticket.Priority.ToString(), updateDto.Priority.ToString(), changedBy);
        }

        // Check other changes
        if (ticket.Title != updateDto.Title)
            await LogHistoryAsync(id, nameof(Ticket.Title), ticket.Title, updateDto.Title, changedBy);

        if (ticket.Description != updateDto.Description)
            await LogHistoryAsync(id, nameof(Ticket.Description), ticket.Description, updateDto.Description, changedBy);

        if (ticket.Category != updateDto.Category)
            await LogHistoryAsync(id, nameof(Ticket.Category), ticket.Category, updateDto.Category, changedBy);

        ticket.Title = updateDto.Title;
        ticket.Description = updateDto.Description;
        ticket.Category = updateDto.Category;
        ticket.Priority = updateDto.Priority;
        ticket.Status = updateDto.Status;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(ticket);
        return MapToDto(ticket);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ticket = await _repository.GetByIdAsync(id);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {id} was not found.");

        await _repository.DeleteAsync(ticket);
        return true;
    }

    public async Task<TicketDto?> UpdateStatusAsync(int id, TicketStatus status, string changedBy)
    {
        var ticket = await _repository.GetByIdAsync(id);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {id} was not found.");

        if (ticket.Status != status)
        {
            ValidateStatusTransition(ticket.Status, status);
            var oldStatus = ticket.Status;
            ticket.Status = status;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(ticket);
            await LogHistoryAsync(id, nameof(Ticket.Status), oldStatus.ToString(), status.ToString(), changedBy);
        }

        return MapToDto(ticket);
    }

    public async Task<TicketDto?> AssignAsync(int id, string? assignedTo, string changedBy)
    {
        var ticket = await _repository.GetByIdAsync(id);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {id} was not found.");

        if (ticket.AssignedTo != assignedTo)
        {
            var oldAssigned = ticket.AssignedTo ?? "Unassigned";
            var newAssigned = assignedTo ?? "Unassigned";

            ticket.AssignedTo = assignedTo;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(ticket);
            await LogHistoryAsync(id, nameof(Ticket.AssignedTo), oldAssigned, newAssigned, changedBy);
        }

        return MapToDto(ticket);
    }

    // Advanced features implementation
    public async Task<TicketCommentDto> AddCommentAsync(int ticketId, CreateCommentDto commentDto, string createdBy)
    {
        var ticket = await _repository.GetByIdAsync(ticketId);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {ticketId} was not found.");

        var comment = new TicketComment
        {
            TicketId = ticketId,
            CommentText = commentDto.CommentText,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddCommentAsync(comment);

        // Audit comment creation
        await LogHistoryAsync(ticketId, "Comment", "", $"Added comment by {createdBy}", createdBy);

        return new TicketCommentDto
        {
            Id = comment.Id,
            TicketId = comment.TicketId,
            CommentText = comment.CommentText,
            CreatedBy = comment.CreatedBy,
            CreatedAt = comment.CreatedAt
        };
    }

    public async Task<IEnumerable<TicketCommentDto>> GetCommentsAsync(int ticketId)
    {
        var ticket = await _repository.GetByIdAsync(ticketId);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {ticketId} was not found.");

        var comments = await _repository.GetCommentsAsync(ticketId);
        return comments.Select(c => new TicketCommentDto
        {
            Id = c.Id,
            TicketId = c.TicketId,
            CommentText = c.CommentText,
            CreatedBy = c.CreatedBy,
            CreatedAt = c.CreatedAt
        });
    }

    public async Task<IEnumerable<TicketHistoryDto>> GetHistoryAsync(int ticketId)
    {
        var ticket = await _repository.GetByIdAsync(ticketId);
        if (ticket == null)
            throw new NotFoundException($"Ticket with ID {ticketId} was not found.");

        var history = await _repository.GetHistoryAsync(ticketId);
        return history.Select(h => new TicketHistoryDto
        {
            Id = h.Id,
            TicketId = h.TicketId,
            FieldName = h.FieldName,
            OldValue = h.OldValue,
            NewValue = h.NewValue,
            ChangedBy = h.ChangedBy,
            ChangedAt = h.ChangedAt
        });
    }

    private async Task LogHistoryAsync(int ticketId, string fieldName, string oldValue, string newValue, string changedBy)
    {
        var history = new TicketHistory
        {
            TicketId = ticketId,
            FieldName = fieldName,
            OldValue = oldValue,
            NewValue = newValue,
            ChangedBy = changedBy,
            ChangedAt = DateTime.UtcNow
        };
        await _repository.AddHistoryAsync(history);
    }

    private void ValidateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus)
    {
        if (currentStatus == newStatus) return;

        bool isValid = currentStatus switch
        {
            TicketStatus.Open => newStatus == TicketStatus.InProgress || newStatus == TicketStatus.Closed,
            TicketStatus.InProgress => newStatus == TicketStatus.Resolved || newStatus == TicketStatus.Closed,
            TicketStatus.Resolved => newStatus == TicketStatus.InProgress || newStatus == TicketStatus.Closed,
            TicketStatus.Closed => newStatus == TicketStatus.Open,
            _ => false
        };

        if (!isValid)
        {
            throw new ValidationException($"Transition from {currentStatus} to {newStatus} is not allowed.");
        }
    }

    private TicketDto MapToDto(Ticket ticket)
    {
        return new TicketDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category,
            Priority = ticket.Priority,
            Status = ticket.Status,
            CreatedBy = ticket.CreatedBy,
            AssignedTo = ticket.AssignedTo,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt
        };
    }
}
