
using Microsoft.AspNetCore.SignalR;

namespace ProductsApi.Hubs;

public class ProductHub : Hub {
    public async Task SendProductAddedNotification(Product addProduct)
    {
        await Clients.Others.SendAsync("productAdded", addProduct);
    }
}