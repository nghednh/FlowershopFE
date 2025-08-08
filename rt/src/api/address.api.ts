import instance from "../config/axios-customize";
import { IBackendRes } from "../types/backend";

export const AddressService = {
  // any: {id: number, fullName: string, streetAddress: string, city: string, phoneNumber: string, applicationUserId: number}
  createAddress: (addressData: {
    fullName: string;
    streetAddress: string;
    city: string;
    phoneNumber: string;
  }): Promise<any> => {
    return instance.post('/api/Address', addressData);
  },

  // any: {id: number, fullName: string, streetAddress: string, city: string, phoneNumber: string, applicationUserId: number}
  getUserAddresses: (): Promise<any[]> => {
    return instance.get('/api/Address/user');
  },

  // any: {id: number, fullName: string, streetAddress: string, city: string, phoneNumber: string, applicationUserId: number}
  getAddressById: (addressId: number): Promise<any> => {
    return instance.get(`/api/Address/${addressId}`);
  },

  updateAddress: (addressId: number, addressData: {
    fullName: string;
    streetAddress: string;
    city: string;
    phoneNumber: string;
  }): Promise<any> => {
    return instance.put(`/api/Address/${addressId}`, addressData);
  },

  deleteAddress: (addressId: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/Address/${addressId}`);
  },
};
