
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

using  ProductsApi.Data;
using  ProductsApi.Hubs;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger;
    private readonly AppDbContext _context;
    private readonly IHubContext<ProductHub> _productsHubContext;

    public ProductsController(ILogger<ProductsController> logger, AppDbContext context, IHubContext<ProductHub> productsHubContext)
    {
        _logger = logger;
        _context = context;
        _productsHubContext = productsHubContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(new { data = products });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await _context.Products.FindAsync(id);
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Post([FromBody] Product addProduct)
    {
      await _context.Products.AddAsync(addProduct);
      if ( await _context.SaveChangesAsync() > 0 ) {
        // /** brodacast changes to signalr clients. */
        // // await _productsHubContext.Clients.All.SendAsync("productAdded", addProduct);
        // await _productsHubContext.Clients.Others.SendAsync("productAdded", addProduct);
        
        return Ok(addProduct);
      }

      return StatusCode(500);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> Put(int id, [FromBody] Product updProduct)
    {

      if(id == updProduct.Id) {
        var p = await _context.Products.FindAsync(id);

        if(p != null) {
          p.Code = updProduct.Code;
          p.Name = updProduct.Name;
          p.Description = updProduct.Description;
          p.Image = updProduct.Image;
          p.Price = updProduct.Price;
          p.Category = updProduct.Category;
          p.Quantity = updProduct.Quantity;
          p.InventoryStatus = updProduct.InventoryStatus;
          p.Rating = updProduct.Rating;

          if (await _context.SaveChangesAsync() > 0 ) {
            /** brodacast changes to signalr clients. */
            await _productsHubContext.Clients.All.SendAsync("productUpdated", updProduct);

            return Ok(updProduct);
          }

        }
      }

      return NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id) {
      
      var delProduct = _context.Products.Find(id);

      if(delProduct != null) {
        _context.Products.Remove(delProduct);
        if (await _context.SaveChangesAsync() > 0 ) {
            /** brodacast changes to signalr clients. */
            await _productsHubContext.Clients.All.SendAsync("productDeleted", id);
            
            return NoContent();
        }
      }

      return NotFound();
    }
}
