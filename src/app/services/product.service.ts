import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {concatMap, Observable, tap} from "rxjs";
import {OfflineService} from "./offline.service";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private onlineService :OnlineService , private offlineService :OfflineService ,private imageService :ImageService) { }


  isOnline(): boolean {
    return navigator.onLine;
  }


  addNewProduct(product :Product):Observable<void>{
   return  this.onlineService.addNewProduct(product);

  }

  getProducts() {
    if (this.isOnline()) {
      console.log("app is online ");
      return this.onlineService.getProducts().pipe(
        tap((products: Product[]) => {
          console.log("before");
          console.log(products);
        }),
        concatMap((products) =>
          this.imageService.mapProductsToBase64(products)
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

}
