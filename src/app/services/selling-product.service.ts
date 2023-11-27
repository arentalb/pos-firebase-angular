import { Injectable } from '@angular/core';
import {ProductService} from "./product.service";
import {ImageService} from "./image.service";
import {Product} from "../models/product";
import {SellingOfflineService} from "./selling-offline.service";
import {SellingOnlineService} from "./selling-online.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SellingProductService {
  isOnline(): boolean {
    return navigator.onLine;
  }
  constructor(private productService :ProductService
              , private sellingOfflineService :SellingOfflineService
              , private sellingOnlineService :SellingOnlineService ) {
    console.log("this.newDataSubject ")

  }

  fetchAvailableProducts() {
   return  this.productService.getProducts()
  }

  sellAllSoldProducts(products :Product[]){
    if (this.isOnline()){
     return  this.sellingOnlineService.sellProducts(products)
    }else {
      return  this.sellingOfflineService.sellProducts(products)

    }
  }
}
