import { Injectable } from '@angular/core';
import {Product} from "../models/product";
import {OnlineService} from "./online.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private onlineService :OnlineService) { }
  addNewProduct(product :Product){
    this.onlineService.addnewProduct();

  }
}
