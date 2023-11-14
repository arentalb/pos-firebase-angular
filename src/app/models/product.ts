import {Category} from "./category";

export interface Product {
  id ?: number ;
  name :string ;
  basePrice :number ;
  salePrice :number ;
  quantity :number ;
  image : File;
  imageUrl: string;
  category :Category;
  sellQuantity:number ;
}
