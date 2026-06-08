using System.ComponentModel.DataAnnotations;

namespace HelpdeskService.DTOs;

public class CreateCommentDto
{
    [Required]
    public string CommentText { get; set; } = string.Empty;
}
