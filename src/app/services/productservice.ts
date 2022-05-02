import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import { Product } from '../domain/product';

@Injectable()
export class ProductService {

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    productNames: string[] = [
        "Bamboo Watch", 
        "Black Watch", 
        "Blue Band", 
        "Blue T-Shirt", 
        "Bracelet", 
        "Brown Purse", 
        "Chakra Bracelet",
        "Galaxy Earrings",
        "Game Controller",
        "Gaming Set",
        "Gold Phone Case",
        "Green Earbuds",
        "Green T-Shirt",
        "Grey T-Shirt",
        "Headphones",
        "Light Green T-Shirt",
        "Lime Band",
        "Mini Speakers",
        "Painted Phone Case",
        "Pink Band",
        "Pink Purse",
        "Purple Band",
        "Purple Gemstone Necklace",
        "Purple T-Shirt",
        "Shoes",
        "Sneakers",
        "Teal T-Shirt",
        "Yellow Earbuds",
        "Yoga Mat",
        "Yoga Set",
    ];

    constructor(private http: HttpClient) { }

    // getProducts() {
    //     return this.http.get<any>('assets/data/products.json')
    //     .toPromise()
    //     .then(res => <Product[]>res.data)
    //     .then(data => { return data; });
    // }
    // getProducts() {
    //     return this.http.get<any>('http://127.0.0.1:5244/api/products')
    //     .toPromise()
    //     .then(res => <Product[]>res.data)
    //     .then(data => { return data; });
    // }
    
    getProducts(): Observable<any> {
        return this.http.get<GetProductsResponse>('http://127.0.0.1:5244/api/products')
            .pipe(map(rsp => { return rsp.data; }), catchError(this.handleError));
    }

    addProduct(addProduct: Product): Observable<any> {
        return this.http.post<any>('http://127.0.0.1:5244/api/products', addProduct)
            .pipe(map(rsp => { return rsp; }), catchError(this.handleError));
    }

    updateProduct(productId: number, updProduct: Product): Observable<any> {
        const url = 'http://127.0.0.1:5244/api/products/' + productId;
        return this.http.put<any>(url, updProduct)
            .pipe(map(rsp => { return rsp; }), catchError(this.handleError));
    }

    deleteProduct(productId: number): Observable<any> {
        const url = 'http://127.0.0.1:5244/api/products/' + productId;
        return this.http.delete<any>(url)
            .pipe(map(rsp => { return rsp; }), catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error.message);
        return throwError('An error occurred in ProductsService method. Please try again or contact IT if problem persists.');
    }
}
    
interface GetProductsResponse {
    data: {
        products: Product[]
    }
}