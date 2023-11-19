import { Injectable } from '@angular/core';
import {RxDBService} from "./rx-db.service";
import {Product} from "../models/product";
import {concatMap, from, Observable, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor( private rxdbService :RxDBService ,private imageService: ImageService) { }

  saveProducts(products : Product[]){
    console.log("in saveProducts for offline in OfflineService")
    this.rxdbService.saveProducts(products).then(() => {
      console.log('Products saved');
    })

  }
  getSavedProducts():Observable<Product[]>{
    return from(this.rxdbService.getSavedProducts()).pipe(
      catchError((error) => {
        console.error('Error retrieving products:', error);
        return of([]); // Return an empty array in case of an error
      })
    );
  }
}
