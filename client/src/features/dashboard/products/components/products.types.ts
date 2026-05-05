export interface ProductFormState {
  name: string;
  nameEn: string;
  nameAr: string;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  originalPrice: number;
  oldPrice: number;
  stock: number;
  rating: number;
  reviews: number;
  badge: string;
  inStock: boolean;
  isBestSeller: boolean;
  batteryLife: string;
  noiseCancelling: boolean;
  audioFeatures: string;
  freeShipping: boolean;
  shippingCondition: string;
  warranty: string;
  returns: string;
  categoryId: string;
  isShow: boolean;
}

export const defaultProductFormState: ProductFormState = {
  name: "",
  nameEn: "",
  nameAr: "",
  description: "",
  descriptionEn: "",
  descriptionAr: "",
  price: 0,
  originalPrice: 0,
  oldPrice: 0,
  stock: 0,
  rating: 0,
  reviews: 0,
  badge: "",
  inStock: true,
  isBestSeller: false,
  batteryLife: "",
  noiseCancelling: false,
  audioFeatures: "",
  freeShipping: false,
  shippingCondition: "",
  warranty: "",
  returns: "",
  categoryId: "",
  isShow: true,
};
