using System.Net;
using System.Text.Json;
using HelpdeskService.Exceptions;

namespace HelpdeskService.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var result = string.Empty;

        switch (exception)
        {
            case NotFoundException notFoundException:
                code = HttpStatusCode.NotFound;
                result = JsonSerializer.Serialize(new
                {
                    statusCode = (int)code,
                    message = notFoundException.Message,
                    timestamp = DateTime.UtcNow
                });
                break;

            case ValidationException validationException:
                code = HttpStatusCode.BadRequest;
                result = JsonSerializer.Serialize(new
                {
                    statusCode = (int)code,
                    message = validationException.Message,
                    timestamp = DateTime.UtcNow
                });
                break;

            default:
                code = HttpStatusCode.InternalServerError;
                result = JsonSerializer.Serialize(new
                {
                    statusCode = (int)code,
                    message = "An internal server error occurred.",
                    detail = exception.Message,
                    timestamp = DateTime.UtcNow
                });
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}
