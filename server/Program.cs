
using Microsoft.EntityFrameworkCore;

using  ProductsApi.Data;
using  ProductsApi.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(opts => opts.UseInMemoryDatabase("ProductsDb"));
builder.Services.AddSignalR();
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseRouting();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
    endpoints.MapFallbackToController("Index","Fallback");
    endpoints.MapHub<ProductHub>("/producthub");
});

app.Run();