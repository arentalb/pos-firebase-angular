import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {forkJoin, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SellingOnlineService {

  constructor(private onlineService :OnlineService) { }

  sellProducts(products: Product[]) {
    const observables: Observable<void>[] = [];

    for (const product of products) {
      const observable = this.onlineService.subtractPcsOfSoldProduct(product.key, product.sellQuantity);
      observables.push(observable);
    }

    return forkJoin(observables);
  }

}
