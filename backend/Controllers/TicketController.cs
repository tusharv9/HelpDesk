using HelpdeskService.DTOs;
using HelpdeskService.Models;
using HelpdeskService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskService.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TicketController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets(
        [FromQuery] TicketStatus? status,
        [FromQuery] TicketPriority? priority,
        [FromQuery] string? assignedTo)
    {
        var tickets = await _ticketService.GetAllAsync(status, priority, assignedTo);
        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicket(int id)
    {
        var ticket = await _ticketService.GetByIdAsync(id);
        return Ok(ticket);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket(CreateTicketDto createDto)
    {
        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.CreateAsync(createDto, username);

        return CreatedAtAction(
            nameof(GetTicket),
            new { id = ticket.Id },
            ticket);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto updateDto)
    {
        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.UpdateAsync(id, updateDto, username);
        return Ok(ticket);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        await _ticketService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto statusDto)
    {
        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.UpdateStatusAsync(id, statusDto.Status, username);
        return Ok(ticket);
    }

    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> Assign(int id, [FromBody] AssignTicketDto assignDto)
    {
        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.AssignAsync(id, assignDto.AssignedTo, username);
        return Ok(ticket);
    }

    // Advanced Helpdesk Features Endpoints
    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, [FromBody] CreateCommentDto commentDto)
    {
        var username = User.Identity?.Name ?? "Anonymous";
        var comment = await _ticketService.AddCommentAsync(id, commentDto, username);
        return Ok(comment);
    }

    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(int id)
    {
        var comments = await _ticketService.GetCommentsAsync(id);
        return Ok(comments);
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        var history = await _ticketService.GetHistoryAsync(id);
        return Ok(history);
    }
}