import { IBackendRes, IPaymentRequest, IPaymentResponse } from "../types/backend";
import instance from "../config/axios-customize";

export const PaymentService = {
  createPayment: (paymentData: IPaymentRequest): Promise<IBackendRes<IPaymentResponse>> => {
    return instance.post('/api/Payment', paymentData);
  },

  getPaymentStatus: (paymentId: number): Promise<IBackendRes<IPaymentResponse>> => {
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
