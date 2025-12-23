"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  applyCoupon as apiApplyCoupon,
  removeCoupon as apiRemoveCoupon,
  type CoCartResponse,
  type CoCartItem,
} from "@/lib/api/cocart";

interface CartContextType {
  cart: CoCartResponse | null;
  cartItems: CoCartItem[];
  isLoading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: number, quantity?: number, variationId?: number, variation?: Record<string, string>) => Promise<void>;
  updateCartItem: (key: string, quantity: number) => Promise<void>;
  removeCartItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: (code: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
  cartItemsCount: number;
  cartSubtotal: string;
  cartTotal: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CoCartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiGetCart();
      if (response.success && response.cart) {
        setCart(response.cart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1, variationId?: number, variation?: Record<string, string>) => {
      setIsLoading(true);
      try {
        const response = await apiAddToCart(productId, quantity, variationId, variation);
        if (response.success && response.cart) {
          setCart(response.cart);
          setIsCartOpen(true);
        } else if (response.error) {
          console.error("Error adding to cart:", response.error.message);
          throw new Error(response.error.message);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateCartItem = useCallback(
    async (key: string, quantity: number) => {
      setIsLoading(true);
      try {
        const response = await apiUpdateCartItem(key, quantity);
        if (response.success && response.cart) {
          setCart(response.cart);
        } else if (response.error) {
          console.error("Error updating cart:", response.error.message);
          throw new Error(response.error.message);
        }
      } catch (error) {
        console.error("Error updating cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeCartItem = useCallback(
    async (key: string) => {
      setIsLoading(true);
      try {
        const response = await apiRemoveCartItem(key);
        if (response.success && response.cart) {
          setCart(response.cart);
        } else if (response.error) {
          console.error("Error removing from cart:", response.error.message);
          throw new Error(response.error.message);
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClearCart();
      if (response.success && response.cart) {
        setCart(response.cart);
      } else if (response.error) {
        console.error("Error clearing cart:", response.error.message);
        throw new Error(response.error.message);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiApplyCoupon(code);
      if (response.success && response.cart) {
        setCart(response.cart);
        return true;
      } else if (response.error) {
        console.error("Error applying coupon:", response.error.message);
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error applying coupon:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiRemoveCoupon(code);
      if (response.success && response.cart) {
        setCart(response.cart);
        return true;
      } else if (response.error) {
        console.error("Error removing coupon:", response.error.message);
        return false;
      }
      return false;
    } catch (error) {
      console.error("Error removing coupon:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cartItems = cart?.items || [];
  const cartItemsCount = cart?.item_count || 0;
  const cartSubtotal = cart?.totals?.subtotal || "0";
  const cartTotal = cart?.totals?.total || "0";

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        isLoading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        refreshCart,
        cartItemsCount,
        cartSubtotal,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
