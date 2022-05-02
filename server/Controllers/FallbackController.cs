using Microsoft.AspNetCore.Mvc;

namespace ProductsApi.Controllers;

public class FallbackController : Controller
{
    private readonly ILogger<FallbackController> _logger;

    public FallbackController(ILogger<FallbackController> logger)
    {
        _logger = logger;
    }

    public ActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
    }
}
