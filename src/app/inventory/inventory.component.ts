import {Component, OnInit} from '@angular/core';
import { Product } from '../models/product';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {ProductService} from "../services/product.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit{
  formVisibility = false;
  loadingForAddingProduct = false;
  error: string = null;
  success: string = null;
  products: Product[];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getProducts()
      .pipe(
        catchError(error => {
          this.error = 'Error fetching products: ' + error.message;
          return EMPTY;
        }),
        finalize(() => {})
      )
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  addProduct(product: Product) {
    this.loadingForAddingProduct =true ;
    this.productService.addNewProduct(product)
      .pipe(
        catchError(error => {
          this.error = 'Error adding product: ' + error.message;
          return EMPTY;
        }),
        finalize(() => this.loadingForAddingProduct = false)
      )
      .subscribe(() => {
        this.success = 'Product added successfully.';
        this.loadingForAddingProduct = false
      });
  }

  toggleForm() {
    this.formVisibility = !this.formVisibility;
  }
}
