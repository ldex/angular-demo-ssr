import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, first, shareReplay, delay, mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl: string = `${environment.apiUrl}/products`;
  private http: HttpClient = inject(HttpClient);
  products$!: Observable<Product[]>;

  constructor() {
    this.initProducts();
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  getProductById(id: number): Observable<Product> {
    return this.products$.pipe(
      mergeMap((products) => products),
      first((product) => product.id == id)
    );
  }

  initProducts() {
    const params = {
      _sort: 'modifiedDate',
      _order: 'desc',
    };

    const options = {
      params: params
    };

    this.products$ = this.http.get<Product[]>(this.baseUrl, options).pipe(delay(800), shareReplay());
  }

  clearCache() {
    this.initProducts();
  }
}
