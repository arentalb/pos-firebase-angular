import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {Observable, tap} from "rxjs";
import {OfflineService} from "./offline.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private onlineService: OnlineService, private offlineService: OfflineService) {
  }


  isOnline(): boolean {
    return navigator.onLine;
  }


  addNewProduct(product: Product): Observable<void> {
    if (this.isOnline()) {
      console.log(`service (ProductService) - method (addNewProduct) - if block - app is online - ${product.name}`)

      return this.onlineService.addNewProduct(product);
    } else {
      console.log(`service (ProductService) - method (addNewProduct) - else block - app is offline - ${product.name}`)

      return this.offlineService.addNewProductForSync(product);
    }

  }

  getProducts() {
    if (this.isOnline()) {
      console.log(`service (ProductService) - method (getProducts) - if block - app is online `)
      let a =  this.onlineService.getProducts().pipe(
        tap((products: Product[]) => {
          this.offlineService.saveProducts(products)
        })
      );
      a.subscribe(()=>{
        console.log(`service (ProductService) - method (getProducts) - if block - subscribe block `)

      },error => {
        console.log(`service (ProductService) - method (getProducts) - if block - error block  `)
        return this.offlineService.getSavedProducts()
      })
      return a
      // When using AngularFire with Firebase, the library often abstracts away the underlying network
      // operations, and it might not throw observable errors when the internet connection is lost.
      // Instead, AngularFire may automatically try to reconnect when the connection is restored.
    } else {
      console.log(`service (ProductService) - method (getProducts) - else block - app is offline `)
      return this.offlineService.getSavedProducts().pipe(
        tap((data) => {
        })
      );
    }
  }

}
