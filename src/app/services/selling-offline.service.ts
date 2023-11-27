import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {forkJoin, from, Observable, of, Subject, tap} from "rxjs";
import {DexieService} from "./dexie.service";


@Injectable({
  providedIn: 'root'
})
export class SellingOfflineService {

  constructor(private dexieService :DexieService ) { }
  newDataSubject :Subject<string>   =   new Subject<string>()


  sellProducts(products: Product[]): Observable<void[]> {
    const observables = products.map(product =>
      from(this.dexieService.subtractPcsOfSoldProduct(product.key, product.sellQuantity))
        .pipe(tap(()=>{
          this.newDataSubject.next("new data is available ")
        }))
    );

    // Use forkJoin to wait for all observables to complete
    return forkJoin(observables);
  }
  // sellProducts(products: Product[]) {
  //   const observables: Observable<void>[] = [];
  //
  //   for (const product of products) {
  //     const observable = from(this.dexieService.subtractPcsOfSoldProduct(product.key, product.sellQuantity))
  //     product.quantity = product.quantity-product.sellQuantity;
  //     console.log("``````````````")
  //     console.log(product.quantity)
  //     console.log(products)
  //     console.log("``````````````")
  //     observables.push(observable);
  //   }
  //
  //   return forkJoin(observables);
  // }

  // sellProducts(products: Product[], index: number = 0) {
  //
  //   if (index < products.length) {
  //     const pro = products[index];
  //     console.log(pro.key);
  //
  //     try {
  //        this.dexieService.subtractPcsOfSoldProduct(products[index].key, products[index].sellQuantity).then(()=>{
  //          products[index].quantity = products[index].quantity-products[index].sellQuantity;
  //
  //        });
  //
  //
  //
  //       console.log("product deleted with the key of " + pro.key);
  //     } catch (error) {
  //
  //       console.error('Error in subscription:');
  //       // Log the error and continue with the next product
  //     }
  //
  //     // Recursively call the function for the next product
  //      this.sellProducts(products, index + 1);
  //   }
  //   return of([])
  // }


}
