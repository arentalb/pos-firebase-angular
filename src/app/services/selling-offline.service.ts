import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {forkJoin, from, Observable, Subject, tap} from "rxjs";
import {DexieService} from "./dexie.service";


@Injectable({
  providedIn: 'root'
})
export class SellingOfflineService {

  newDataSubject: Subject<string> = new Subject<string>()

  constructor(private dexieService: DexieService) {
  }

  sellProducts(products: Product[]): Observable<void[]> {
    console.log(`service (SellingOfflineService) - method (sellProducts) `)

    const observables = products.map(product =>
      from(this.dexieService.subtractPcsOfSoldProduct(product.key, product.sellQuantity))
        .pipe(tap(() => {
          this.newDataSubject.next("new data is available ")
        }))
    );

    return forkJoin(observables);
  }



}
