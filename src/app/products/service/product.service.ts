import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interface/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Kid,
    tags: [],
    images: [],
    user: {} as User,
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductsResponse>();

    private productCache = new Map<string, Product>();

    getProducts(options: Options): Observable<ProductsResponse> {

        const { limit = 9, offset = 0, gender = '' } = options;

        const key = `${limit}-${offset}-${gender}`; // '9-0-'

        if (this.productsCache.has(key)) {
            return of(this.productsCache.get(key)!);
        }

        return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        })
            .pipe(
                tap((resp) => this.productsCache.set(key, resp))
            )
    }

    getProductByIdSlug(idSlug: string): Observable<Product> {

        if (this.productCache.has(idSlug)) {
            return of(this.productCache.get(idSlug)!)
        }

        return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
            .pipe(
                delay(500),
                tap((resp) => this.productCache.set(idSlug, resp)),
            )
    }

    getProductById(id: string): Observable<Product> {

        if (id === 'new') {
            return of(emptyProduct);
        }

        if (this.productCache.has(id)) {
            return of(this.productCache.get(id)!)
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`)
            .pipe(
                tap((resp) => this.productCache.set(id, resp)),
            )
    }

    createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
        return this.http.post<Product>(`${baseUrl}/products`, productLike)
            .pipe(tap((resp) => this.updateProductCache(resp, 'create')));
    }

    updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

        const currentImages = productLike.images ?? [];

        return this.uploadImages(imageFileList).pipe(
                map((imageNames) => ({
                    ...productLike,
                    images: [...currentImages, ...imageNames]
                })),
                // Obtain the updated product with the new images
                // then, resolve the observable with the updated product
                switchMap( (updatedProduct) => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct) ),
                tap((resp) => this.updateProductCache(resp))
            )
    }

    updateProductCache(product: Product, action: 'create' | 'update' = 'update') {
        const productId = product.id;

        this.productCache.set(productId, product);

        if (action === 'update') {
            this.productsCache.forEach(productResponse => {
                productResponse.products = productResponse.products.map((currentProduct) => currentProduct.id === productId ? product : currentProduct)
            });
        }

    }

    uploadImages(images?: FileList): Observable<string[]> {
        if (!images) return of([]);

        const uploadObservables = Array.from(images).map(image => this.uploadImage(image));

        // forkJoin waits for all observables to complete and returns an array of results
        // If any observable fails, forkJoin will fail as well
        return forkJoin(uploadObservables)
            .pipe(tap((imageNames) => console.log({ imageNames })))
    }

    uploadImage(imageFile: File): Observable<string> {

        const formData = new FormData();

        formData.append('file', imageFile);

        return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
            .pipe(map(resp => resp.fileName));

    }

}