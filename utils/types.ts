export interface IProduct {
  id: number;
  title: string;
  price: number;

  description: string;
  category: { id: number; name: string } | null;
  images: string[];
}

export interface ICartItem {
  productId: number;
  quantity: number;
  product?: IProduct;
}

export interface ICartState {
  items: ICartItem[];
}
