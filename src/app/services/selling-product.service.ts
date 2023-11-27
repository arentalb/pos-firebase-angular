import {Injectable} from '@angular/core';
import {ProductService} from "./product.service";
import {Product} from "../models/product";
import {SellingOfflineService} from "./selling-offline.service";
import {SellingOnlineService} from "./selling-online.service";

@Injectable({
  providedIn: 'root'
})
export class SellingProductService {
  constructor(private productService: ProductService
    , private sellingOfflineService: SellingOfflineService
    , private sellingOnlineService: SellingOnlineService) {

  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  fetchAvailableProducts() {
    console.log(`service (SellingProductService) - method (fetchAvailableProducts) `)

    return this.productService.getProducts()
  }

  sellAllSoldProducts(products: Product[]) {
    console.log(`service (SellingProductService) - method (sellAllSoldProducts)  `)

    if (this.isOnline()) {
      console.log(`service (SellingProductService) - method (sellAllSoldProducts) - online`)

      return this.sellingOnlineService.sellProducts(products)
    } else {
      console.log(`service (SellingProductService) - method (sellAllSoldProducts) - offline`)

      return this.sellingOfflineService.sellProducts(products)

    }
  }
}
