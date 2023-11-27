import {Injectable} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {from, map, Observable, take, tap, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFireDatabase
  ) {
  }

  subtractPcsOfSoldProduct(productKey: string, productPcs: number): Observable<void> {
    console.log(`service (OnlineService) - method (subtractPcsOfSoldProduct) -  key ${productKey} - psc ${productPcs}   `)

    const productRef = this.db.object(`products/${productKey}`); // Adjust the path accordingly

    return productRef.valueChanges().pipe(
      take(1), // Take one snapshot of the current product state
      switchMap((product: Product) => {
        if (product) {
          const newPcs = product.quantity - productPcs;
          if (newPcs >= 0) { // Ensure the quantity doesn't go below zero
            return from(productRef.update({quantity: newPcs}));
          } else {
            throw new Error('Not enough quantity available.');
          }
        } else {
          throw new Error('Product not found.');
        }
      }),
      catchError((error) => {
        // console.error('Error updating product quantity:', error);
        return throwError(error);
      })
    );
  }

  getProducts(): Observable<Product[]> {
    console.log(`service (OnlineService) - method (getProducts)   `)

    const productsRef = this.db.list('products');
    return productsRef.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => {
          const data = c.payload.val() as Product;
          const key = c.payload.key;
          return {key, ...data};
        });
      }),
      catchError(error => {
        console.log(`service (OnlineService) - method (getProducts) - error  `)
        throw error;
      })
    );
  }

  addNewProduct(product: Product): Observable<void> {
    console.log(`service (OnlineService) - method (addNewProduct)  - ${product.name}`)
    return from(this.uploadImage(product.image))
      .pipe(
        switchMap(imageUrl => this.saveProductToDatabase(product, imageUrl)),
        catchError(error => {
          console.log(`service (OnlineService) - method (addNewProduct) - error - ${product.name} `)
          throw error;
        })
      );
  }

  syncNewProduct(product: Product) {
    console.log(`service (OnlineService) - method (syncNewProduct) - ${product.name} `)
    return from(this.uploadImage(product.image))
      .pipe(
        tap(() => {
          if (product.quantity === 1) {
            console.log(`service (OnlineService) - method (syncNewProduct) - error - ${product.name}`)
            throw new Error(`error in  (OnlineService) - (syncNewProduct) if block - ${product.name} `)
          }
        }),
        switchMap(imageUrl => this.saveProductToDatabase(product, imageUrl)),
        catchError(error => {
          console.log(`service (OnlineService) - method (syncNewProduct) - error - ${product.name} `)
          throw error;
        })
      )
  }

  private uploadImage(image: File): Promise<string> {
    console.log(`service (OnlineService) - method (uploadImage) - ${image.name}`)

    const filePath = `images/${Date.now()}_${image.name}`;
    const storageRef = this.storage.ref(filePath);
    return storageRef.put(image).then(() => storageRef.getDownloadURL().toPromise());
  }

  private saveProductToDatabase(product: Product, imageUrl: string): Observable<void> {
    console.log(`service (OnlineService) - method (saveProductToDatabase) - ${product.name}`)

    const productsRef = this.db.list('products');
    product.imageUrl = imageUrl;
    delete product.image;

    let pro: Product = {...product, key: null}


    return new Observable<void>(observer => {
      productsRef.push(pro)
        .then(() => {
          console.log(`service (OnlineService) - method (saveProductToDatabase) - product added - ${product.name}`)
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.log(`service (OnlineService) - method (saveProductToDatabase) - error - ${product.name}`)
          observer.error(error);
        });
    });
  }

}
