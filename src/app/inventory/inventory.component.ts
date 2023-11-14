import { Component } from '@angular/core';
import { Product } from '../models/product';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  formVisibility = false;
  loading = false;
  error: string = null;
  success: string = null;
  products: Product[];

  constructor(private productService: ProductService) {}

  addProduct(product: Product) {
    this.loading =true ;
    this.productService.addNewProduct(product)
      .pipe(
        catchError(error => {
          this.error = 'Error adding product: ' + error.message;
          return EMPTY;
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(() => {
        this.success = 'Product added successfully.';
        this.loading = false
      });
  }

  toggleForm() {
    this.formVisibility = !this.formVisibility;
  }
}
