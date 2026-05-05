import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { Product } from "@/types/api";
import { cartService, CartApiData } from "@/api/cart.service";
import { resolveMediaUrl } from "@/lib/media-url";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string) => Promise<void>;
  removeItem: (productId: string, size?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeCartItems = useCallback((cart?: CartApiData): CartItem[] => {
    const rawItems = cart?.items ?? [];
    return rawItems
      .filter((item) => Boolean(item.productId))
      .map((item) => {
        const product = item.productId!;
        const productId = product._id || product.id || "";
        const name = product.name || product.nameEn || product.nameAr || "";
        const image = resolveMediaUrl(product.mainImage || product.images?.main || "");
        const category =
          typeof product.categoryId === "object"
            ? (product.categoryId?.name || product.categoryId?.nameEn || "")
            : (product.category || "");

        return {
          product: {
            ...(product as unknown as Product),
            _id: productId,
            id: productId,
            name,
            price: Number(product.price || 0),
            mainImage: product.mainImage || product.images?.main || "",
            images: product.images || { main: product.mainImage || "", gallery: [] },
            categoryId: product.categoryId || "",
            // Backward-compatible view fields consumed in current UI.
            image,
            category,
          } as Product,
          quantity: item.quantity,
          size: item.size,
        };
      });
  }, []);

  const syncFromServer = useCallback(async () => {
    try {
      const response = await cartService.getCart();
      setItems(normalizeCartItems(response?.data?.cart));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [normalizeCartItems]);

  useEffect(() => {
    syncFromServer();
  }, [syncFromServer]);

  const addItem = useCallback(async (product: Product, quantity = 1, size?: string) => {
    const productId = product._id || product.id;
    if (!productId) return;

    const response = await cartService.addItem({ productId, quantity, size });
    setItems(normalizeCartItems(response?.data?.cart));
  }, [normalizeCartItems]);

  const removeItem = useCallback(async (productId: string, size?: string) => {
    const response = await cartService.removeItem(productId, size);
    setItems(normalizeCartItems(response?.data?.cart));
  }, [normalizeCartItems]);

  const updateQuantity = useCallback(async (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      await removeItem(productId, size);
      return;
    }
    const response = await cartService.updateItem({ productId, quantity, size });
    setItems(normalizeCartItems(response?.data?.cart));
  }, [normalizeCartItems, removeItem]);

  const clearCart = useCallback(async () => {
    const response = await cartService.clearCart();
    setItems(normalizeCartItems(response?.data?.cart));
  }, [normalizeCartItems]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, isLoading, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
