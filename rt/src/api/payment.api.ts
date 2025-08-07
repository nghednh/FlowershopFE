import { IPaymentRequest, IPaymentResponse } from "../types/backend";
import instance from "../config/axios-customize";

export const PaymentService = {
  createPayment: (paymentData: IPaymentRequest): Promise<IPaymentResponse> => {
    return instance.post('/api/Payment', paymentData);
  },

  getPaymentStatus: (paymentId: number): Promise<IPaymentResponse> => {
    return instance.get(`/api/Payment/${paymentId}`);
  },

  // VNPay APIs
  vnpayCallback: (params: any): Promise<any> => {
    return instance.get('/api/Vnpay/Callback', { params });
  },

  vnpayIpnAction: (params: any): Promise<any> => {
    return instance.get('/api/Vnpay/IpnAction', { params });
  },
};
