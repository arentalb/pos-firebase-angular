import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class DataErrorService {

  constructor() { }
  productsThatHasError :Subject<Product>= new Subject<Product>()





}
