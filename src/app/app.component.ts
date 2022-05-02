import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from './domain/product';
import { ProductService } from './services/productservice';
import {ToastModule} from 'primeng/toast';
import { SignalRService } from './services/SignalR.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ConfirmationService,MessageService,ProductService]
})
export class AppComponent implements OnInit {

    productDialog: boolean;

    products: Product[];

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;

    statuses: any[];

    constructor(
        private productService: ProductService, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private readonly signalrSvc: SignalRService
        ) {
            signalrSvc.productAdded.subscribe(product => {
                this.products = [product, ...this.products];
            });

            signalrSvc.productUpdated.subscribe(product => {
                this.products = this.products.filter(x => x.id !== product.id);
                this.products = [product, ...this.products];
            });

            signalrSvc.productDeleted.subscribe(productId => {
                this.products = this.products.filter(x => x.id !== productId);
            });
        }

    ngOnInit() {
        // this.productService.getProducts().then(data => this.products = data);
        this.productService.getProducts().subscribe(products => {
            this.products = products;
        });

        this.statuses = [
            {label: 'INSTOCK', value: 'instock'},
            {label: 'LOWSTOCK', value: 'lowstock'},
            {label: 'OUTOFSTOCK', value: 'outofstock'}
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.selectedProducts = null;
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
            }
        });
    }

    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productService.deleteProduct(parseInt(product.id)).subscribe(() => console.log('deleted'), err => console.error(err), () => {
                    this.products = this.products.filter(val => val.id !== product.id);
                    this.product = {};
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
    
    saveProduct() {
        this.submitted = true;

        if (this.product.name.trim()) {
            if (this.product.id) {

                this.productService.updateProduct(parseInt(this.product.id), this.product).subscribe(data => 
                { 
                    this.product = data; console.log('updated');
                }
                , err => console.log(err)
                , () => {
                    this.products[this.findIndexById(this.product.id)] = this.product;                
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                });
            }
            else {
                
                this.product.image = 'product-placeholder.svg';
                this.productService.addProduct(this.product).subscribe(data => 
                { 
                    this.product = data; console.log('added');
                }
                , err => console.log(err)
                , () => {
                    this.signalrSvc.sendProductAdded(this.product);
                    this.products.push(this.product);
                    this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( var i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}
