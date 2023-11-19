import {Injectable} from '@angular/core';
import {addRxPlugin, createRxDatabase, RxDatabase} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {RxDBMigrationPlugin} from 'rxdb/plugins/migration';
import {Product} from "../models/product";
import {RxDBAttachmentsPlugin} from 'rxdb/plugins/attachments';
// import {RxDBDevModePlugin} from "rxdb/dist/types/plugins/dev-mode";
// addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBAttachmentsPlugin);

@Injectable({
  providedIn: 'root',
})
export class RxDBService {
  mySchema = {
    title: 'product',
    version: 1,
    description: 'describes a product',
    primaryKey: "key",
    type: 'object',
    properties: {
      key: {
        type: 'string',
        maxLength: 100
      },
      name: {
        type: 'string',
      },
      basePrice: {
        type: 'number',
      },
      salePrice: {
        type: 'number',
      },
      quantity: {
        type: 'number',
      },
      image: {
        type: 'string',
      },
      imageUrl: {
        type: 'string',
      },
      category: {
        type: 'string',
        enum: [
          'Groceries',
          'Meat and Seafood',
          'Bakery',
          'Frozen Foods',
          'Cleaning Supplies',
          'Electronics',
          'Toys',
          'Other',
        ],
      },
      sellQuantity: {
        type: 'number',
      },
    },
    required: [
      'name',
      'basePrice',
      'salePrice',
      'quantity',
      'category',
      'sellQuantity',
    ],
  };


  private myDatabase: RxDatabase | null = null; // Store the database instance

  constructor() {
    this.initDatabase().then((result) => {
      this.myDatabase = result; // Save the database instance
      console.log('Database created:', result);
      // to insert initial object for testing
      // this.insertSampleObject(result).then(()=>{
      //
      // });
    });

  }

  async saveProducts(products: Product[]): Promise<void> {

    // console.log("in rxDb service in saveProducts");
    console.log(products);

    if (!this.myDatabase) {
      console.error('Database not initialized');
      return;
    }

    // Iterate through each product and save it to the database
    for (const product of products) {
      try {
        let ifExists = await this.myDatabase["products"].find({
          selector: {
            key: product.key,
          },
        }).exec();

        const productAlreadyExists = ifExists.length > 0;
        // console.log("condition exists or not " + productAlreadyExists);

        if (productAlreadyExists) {
          // await existingProduct.update({ $set: product });
          console.log(`Product '${product.name}' already exists`);
        } else {
          await this.myDatabase['products'].insert(product);
          // console.log("this product added to offline database ");
          // console.log(product);
          console.log(`Product '${product.name}' added to the offline database`);
        }
      } catch (error) {
        console.error(`Error saving product '${product.name}':`, error);
        console.error(error.stack); // Log the stack trace for more details
      }
    }
  }


  async getSavedProducts(): Promise<Product[]> {
    if (!this.myDatabase) {
      console.error('Database not initialized.');
      return [];
    }

    try {
      const products = await this.myDatabase['products'].find().exec();
      console.log('Products retrieved:');
      return products;
    } catch (error) {
      console.error('Error retrieving products:', error);
      return [];
    }
  }

  private async initDatabase(): Promise<RxDatabase> {
    const myDatabase = await createRxDatabase({
      name: 'mydatabase',
      storage: getRxStorageDexie(),
    });

    await myDatabase.addCollections({
      products: {
        schema: this.mySchema,
      },
    });

    return myDatabase;
  }

}

// private async insertSampleObject(database: RxDatabase): Promise<void> {
//
//   const sampleObject = {
//     id: '1',
//     name: 'Sample Product',
//     basePrice: 10.99,
//     salePrice: 8.99,
//     quantity: 100,
//     image: 'sample-image.jpg',
//     imageUrl: 'https://example.com/sample-image.jpg',
//     category: 'Other',
//     sellQuantity: 0,
//   };
//
//
//   try {
//     const myDocument = await database['products'].insert(sampleObject);
//     console.log('Sample object inserted:', sampleObject);
//   } catch (error) {
//     console.error('Error inserting sample object:', error);
//   }
//   console.log('Sample object inserted:', sampleObject);
// }
