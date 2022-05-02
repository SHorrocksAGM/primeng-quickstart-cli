import { Injectable } from '@angular/core';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { Product } from '../domain/product';

@Injectable({providedIn: 'root'})
export class SignalRService {
    
    private connection: HubConnection;
    productAdded: Subject<Product> = new Subject<Product>();
    productUpdated: Subject<Product> = new Subject<Product>();
    productDeleted: Subject<Product> = new Subject<Product>();
    
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl('http://127.0.0.1:5244/producthub')
            .build();

        this.registerOnEvents();
        this.connection.start().catch(err => console.log(err.toString()));
    }

    registerOnEvents() {
        this.connection.on('productAdded', product => {
            console.log('productAdded');
            this.productAdded.next(product);
        });
  
        this.connection.on('productUpdated', product => {
            console.log('productUpdated');
            this.productUpdated.next(product);
        });

        this.connection.on('productDeleted', productId => {
            console.log('productDeleted');
            this.productDeleted.next(productId);
        });
    }

    public sendProductAdded (addedProduct: Product) {
        this.connection.send('SendProductAddedNotification', addedProduct);
    }
}