import {Category} from "./category";

export interface Product {
  key ?: string ;
  name :string ;
  basePrice :number ;
  salePrice :number ;
  quantity :number ;
  image : File;
  imageUrl: string;
  category :Category;
  sellQuantity:number ;
}
