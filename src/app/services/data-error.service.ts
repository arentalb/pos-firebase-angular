import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class DataErrorService {

  productsThatHasError: Subject<Product> = new Subject<Product>()

  constructor() {
  }


}
