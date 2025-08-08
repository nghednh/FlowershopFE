import { IOrder, PaymentMethod } from "../types/backend";
import instance from "../config/axios-customize";

export const OrderService = {
  createOrder: (orderData: { cartId: number; addressId: number; paymentMethod: PaymentMethod }): Promise<IOrder> => {
    return instance.post('/api/orders', orderData);
  },

  getOrders: (): Promise<IOrder[]> => {
    return instance.get('/api/orders');
  },

  getOrderHistory: (): Promise<IOrder[]> => {
    return instance.get('/api/orders/history');
  },

  getOrderDetails: (orderId: number): Promise<IOrder> => {
    return instance.get(`/api/orders/${orderId}`);
  },

  cancelOrder: (orderId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/orders/${orderId}`);
  },

  updateOrder: (orderId: number, orderStatus: number, trackingNumber: string): Promise<IOrder> => {
    return instance.put(`/api/Orders/${orderId}`, { orderStatus: orderStatus, trackingNumber });
  },

  getMyOrders: (): Promise<IOrder[]> => {
    return instance.get(`api/Orders/my-orders`);
  },
};
