import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private onlineService :OnlineService) { }
  addNewProduct(product :Product):Observable<void>{
   return  this.onlineService.addNewProduct(product);

  }

  getProducts() {
    return this.onlineService.getProducts()
  }
}
