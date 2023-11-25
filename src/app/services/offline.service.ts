import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {of} from "rxjs";
import {DexieService} from "./dexie.service";

@Injectable({
  providedIn: 'root'
})
export class OfflineService {

  constructor(private dexieservice :DexieService) { }

  saveProducts(products :Product[]){

      this.dexieservice.saveProducts(products).then((data)=>{
        console.log("all products added ")
        console.log(data)
      })

  }
  getSavedProducts(){
    return of([])
  }
}
