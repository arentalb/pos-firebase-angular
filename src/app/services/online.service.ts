import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Product } from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) {}

  addNewProduct(product: Product): Observable<void> {
    console.log("adding new product .....")
    return from(this.uploadImage(product.image))
      .pipe(
        switchMap(imageUrl => this.saveProductToDatabase(product, imageUrl)),
        catchError(error => {
          console.error('Error adding new product:', error);
          throw error;
        })
      );
  }

  private uploadImage(image: File): Promise<string> {
    const filePath = `images/${Date.now()}_${image.name}`;
    const storageRef = this.storage.ref(filePath);
    console.log("image added successfully")
    return storageRef.put(image).then(() => storageRef.getDownloadURL().toPromise());
  }

  private saveProductToDatabase(product: Product, imageUrl: string): Observable<void> {
    const productsRef = this.db.list('products');
    product.imageUrl = imageUrl;
    delete product.image;

    return new Observable<void>(observer => {
      productsRef.push(product)
        .then(() => {
          console.log("product added successfully")
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error saving product to database:', error);
          observer.error(error);
        });
    });
  }

}
