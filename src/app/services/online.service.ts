import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import {from, map, Observable, tap} from 'rxjs';
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

  getProducts(): Observable<Product[]> {
    const productsRef = this.db.list('products');
    return productsRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const data = c.payload.val() as Product;
          const key = c.payload.key;
          return { key, ...data };
        });
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        throw error;
      })
    );
  }

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
  syncNewProduct(product: Product){
    console.log("sync new product .....")
    return from(this.uploadImage(product.image))
      .pipe(
        tap(()=>{
          if (product.quantity===1 ){
            throw new Error("errorrrr")
          }
        }),
        switchMap(imageUrl => this.saveProductToDatabase(product, imageUrl)),
        catchError(error => {
          console.error('Error adding new product:--');
          throw error;
        })
      )
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
