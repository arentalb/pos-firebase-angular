import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {concatMap, from, map, Observable, of, tap, toArray} from "rxjs";
import {OfflineService} from "./offline.service";
import {ImageService} from "./image.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private onlineService: OnlineService
    , private offlineService: OfflineService
    , private imageService: ImageService
  ) {
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  addNewProduct(product: Product): Observable<void> {
    if (this.isOnline()){
      return this.onlineService.addNewProduct(product);

    }else {
      return this.offlineService.addNewProductForSyncLater(product)
    }

  }


  getProducts(): Observable<Product[]> {
    if (this.isOnline()) {
      console.log("app is online ");
      return this.onlineService.getProducts().pipe(
        tap((products: Product[]) => {
          console.log("before");
          console.log(products);
        }),
        concatMap((products) =>
          this.mapProductsToBase64(products)
        ),
        tap((products: Product[]) => {
          console.log("after");
          console.log(products);
          this.offlineService.saveProducts(products)
          console.log("in get product in productService ");
          // products.forEach((data )=>{
          //  console.log(data)
          // })
        })
      );
    } else {
      console.log("app is offline  ");
      return this.offlineService.getSavedProducts().pipe(
        tap((data) => {
          // data.forEach((a) => {
          //   console.log("product name is " + a.name);
          //   console.log(a);
          // });
        })
      );
    }
  }

  private mapProductsToBase64(products: Product[]): Observable<Product[]> {
    let base64ImagePrefix = "data:image/png;base64,"
    console.log("in mapProductsToBase64");
    return from(products).pipe(
      concatMap((product) =>
        this.imageService.downloadAndConvertToBase64(product.imageUrl).pipe(
          map((base64Data) => ({...product, imageUrl: base64ImagePrefix+ base64Data})),
          catchError((error) => {
            // Log the error
            console.error(`Error processing image for product ${product.name}`, error);
            // Return a fallback value or an empty Observable to continue processing other products
            return of(product);
          })
        )
      ),
      toArray() // Convert back to an array after processing all products
    );
  }
}
