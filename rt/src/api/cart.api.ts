import { ICart, IOrder } from "../types/backend";
import instance from "../config/axios-customize";

export const CartService = {
  getCart: (): Promise<any[]> => {
    return instance.get('/api/cart');
  },

  addToCart: (productId: number, quantity: number): Promise<ICart> => {
    return instance.post('/api/Cart/add', { productId, quantity });
  },

  updateCartItem: (cartItemId: number, quantity: number): Promise<ICart> => {
    return instance.put('/api/Cart/update', [{ cartItemId, quantity }]);
  },

  removeFromCart: (cartItemId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/Cart/remove/${cartItemId}`);
  },

  clearCart: (): Promise<{ success: boolean }> => {
    return instance.delete('/api/Cart/clear');
  },

  checkoutCart: (): Promise<IOrder> => {
    return instance.post('/api/cart/checkout');
  },

  getCartTotal: (): Promise<{ total: number }> => {
    return instance.get('/api/Cart/total');
  },

  getCartItemCount: (): Promise<{ count: number }> => {
    return instance.get('/api/Cart/count');
  },

  updateCartItemQuantity: (cartItemId: number, quantity: number): Promise<any> => {
    return instance.put(`/api/Cart/${cartItemId}/quantity`, { quantity });
  },

  getCartDetails: (): Promise<ICart> => {
    return instance.get('/api/Cart');
  },
};
